import { createMiddleware } from '@tanstack/react-start'
import { auth } from '#/lib/auth'
import { redirect } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'

// Middleware utilisé pour protéger les fonctions côté serveur.
// Il vérifie la présence d'une session utilisateur avant d'exécuter la logique suivante.
export const AuthFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    // Récupère les en-têtes de la requête courante côté serveur.
    const headers = getRequestHeaders()

    // Tente d'obtenir la session utilisateur à partir de l'API d'authentification.
    // Si l'utilisateur n'est pas connecté, auth.api.getSession renverra null.
    const session = await auth.api.getSession({ headers })

    // Si aucune session n'est trouvée, on redirige vers la page de connexion.
    if (!session) {
      throw redirect({ to: '/login' })
    }

    // Si la session est valide, on propage la requête vers l'étape suivante
    // en ajoutant la session au contexte, ce qui permet aux composants
    // ou fonctions en aval d'accéder aux informations utilisateur.
    return next({ context: { session } })
  },
)

// Middleware de type request qui s'exécute sur chaque requête HTTP.
// Il protège les routes dont le chemin commence par /dashboard.
export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    // Analyse l'URL de la requête pour déterminer le chemin demandé.
    const url = new URL(request.url)

    // Si la route n'est pas sous /dashboard, aucune vérification d'authentification
    // n'est nécessaire ici et on laisse la requête se poursuivre.
    if (!url.pathname.startsWith('/dashboard')) {
      return next()
    }

    // Pour les routes protégées, on récupère à nouveau les en-têtes
    // et la session utilisateur pour vérifier l'authentification.
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    // Si l'utilisateur n'est pas authentifié, on redirige vers /login.
    if (!session) {
      throw redirect({ to: '/login' })
    }

    // Si la session existe, on inclut la session dans le contexte de la requête.
    // Cela permet au routeur et aux composants d'accéder à l'utilisateur connecté.
    return next({ context: { session } })
  },
)
