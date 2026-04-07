import Link from "next/link"
import { Activity, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

const footerLinks = {
  navegacao: [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Mapa de Risco", href: "#mapa" },
    { name: "Vacinação", href: "#vacinacao" },
    { name: "Conscientização", href: "#conscientizacao" },
  ],
  recursos: [
    { name: "Calendário Vacinal", href: "#" },
    { name: "Postos de Saúde", href: "#" },
    { name: "Perguntas Frequentes", href: "#" },
    { name: "Dados Abertos", href: "#" },
  ],
  governo: [
    { name: "Ministério da Saúde", href: "https://www.gov.br/saude", external: true },
    { name: "DATASUS", href: "https://datasus.saude.gov.br", external: true },
    { name: "OpenDataSUS", href: "https://opendatasus.saude.gov.br", external: true },
    { name: "Portal Gov.br", href: "https://www.gov.br", external: true },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold leading-none tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Saúde Brasil
                </span>
                <span className="text-xs text-muted-foreground">Ministério da Saúde</span>
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Plataforma oficial de monitoramento de saúde pública do Brasil. 
              Dados atualizados em tempo real para informar e proteger a população.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Disque Saúde: 136</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@saude.gov.br</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Brasília, DF - Brasil</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Navegação
            </h3>
            <ul className="space-y-2">
              {footerLinks.navegacao.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Recursos
            </h3>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Governo
            </h3>
            <ul className="space-y-2">
              {footerLinks.governo.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Dados fornecidos pelo OpenDataSUS - Atualização automática a cada 24 horas
          </p>
          <p className="text-sm text-muted-foreground">
            Brasil - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
