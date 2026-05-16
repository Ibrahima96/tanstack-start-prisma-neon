import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { mapUrlFn, scraptUrlFn } from '#/data/item'
import { bulkImportSchema, importSchema } from '#/schemas/import'
import { type SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, LinkIcon, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [discoveredLink, setDiscoverdLink] = useState<Array<SearchResultWeb>>(
    [],
  )
  const [isPending, startTransition] = useTransition()
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())

  function handeleSelectAll() {
    if (selectedUrls.size === discoveredLink.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(discoveredLink.map((link) => link.url)))
    }
  }
  function handleToggleUrls(url: string) {
    const newSelected = new Set(selectedUrls)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    }else{
      newSelected.add(url)
    }
    setSelectedUrls(newSelected)
  }
  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        await scraptUrlFn({ data: value })
        toast.success('scraped Url successfully')
      })
    },
  })

  const bulkForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: bulkImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        const data = await mapUrlFn({ data: value })
        setDiscoverdLink(data)
      })
    },
  })
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Import content</h1>
          <p className="text-muted-foreground pt-1">
            Save web pages to your library for later reading
          </p>
        </div>
        <Tabs defaultValue="single">
          <TabsList className="grid grid-cols-2 w-full gap-2">
            <TabsTrigger value="single" className="gap-2">
              <LinkIcon className="size-4" />
              Single Url
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Globe className="size-4" />
              Bulk Import
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Import Single URL</CardTitle>
                <CardDescription>
                  Scrap and save content from any web app ! 👀
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <form.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com/start/latest"
                              type="url"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="size-2 animate-spin" />
                          "Processing"
                        </>
                      ) : (
                        'Import Url'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Discover and Import multiple URLs a website at once 🚀
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    bulkForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <bulkForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com/start/latest"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <bulkForm.Field
                      name="search"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Filter (Optional)
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="e.g , Blog , docs , totorial"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="size-2 animate-spin" />
                          "Processing"
                        </>
                      ) : (
                        'Import Urls'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
                {/* discovers url links */}
                {discoveredLink.length > 0 && (
                  <div className="space-y-4 mb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Found {discoveredLink.length} Urls
                      </p>
                      <Button
                        onClick={handeleSelectAll}
                        variant={'outline'}
                        className="mt-2"
                        size={'sm'}
                      >
                        {selectedUrls.size === discoveredLink.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-2 rounded-md border p-4">
                      {discoveredLink.map((link) => (
                        <label
                          className="hover:bg-muted/50 flex cursor-pointer items-start rounded-md p-2 gap-3"
                          key={link.url}
                        >
                          <Checkbox
                            className="mt-0.5"
                            onCheckedChange={()=>handleToggleUrls(link.url)}
                            checked={selectedUrls.has(link.url)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {link.title ?? 'title has not been found'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {link.description ??
                                'description has not been found'}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {link.url}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <Button className="w-full">Import</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
