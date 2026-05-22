import { prisma } from '@/db'
import { auth } from '@/lib/auth'
import { FREE_AI_MODEL, openrouter } from '@/lib/openRouter'
import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session) {
          return new Response('Unauthorized', { status: 401 })
        }

        // On recupere l'identifiant de l'item sauvegarde et le texte a resumer
        // depuis le body JSON envoye par le client.
        const { itemId, prompt } = await request.json()

        // Le resume a besoin des deux informations :
        // - itemId pour verifier que la ressource existe et appartient a l'utilisateur
        // - prompt pour fournir le contenu a l'IA
        if (!itemId || !prompt) {
          return new Response('Missing prompt or itemId', { status: 400 })
        }

        // Recherche l'item uniquement s'il appartient a l'utilisateur connecte.
        // Cette condition evite qu'un utilisateur puisse resumer un item d'un autre compte.
        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userId: session.user.id,
          },
        })

        // Si aucun item ne correspond, on renvoie 404 pour signaler que la ressource
        // est introuvable ou inaccessible pour l'utilisateur courant.
        if (!item) {
          return new Response('Item not found', { status: 404 })
        }

        try {
          // Genere le resume avec OpenRouter et le SDK AI.
          // streamText permet de renvoyer la reponse au fur et a mesure de sa generation,
          // ce qui donne une interface plus reactive cote client.
          const result = streamText({
            model: openrouter.chat(FREE_AI_MODEL),
            system: `You are a helpful assistant that creates concise, informative summaries of web content.
Your summaries should:
- Be 2-3 paragraphs long
- Capture the main points and key takeaways
- Be written in a clear, professional tone`,
            prompt: `Please summarize the following content:\n\n${prompt}`,
            onError: ({ error }) => {
              console.error('Failed to stream summary', error)
            },
          })

          // Convertit le flux genere dans le format attendu par useCompletion cote client.
          return result.toTextStreamResponse()
        } catch (error) {
          console.error('Failed to start summary stream', error)
          return new Response('Unable to generate summary', { status: 500 })
        }
      },
    },
  },
})
