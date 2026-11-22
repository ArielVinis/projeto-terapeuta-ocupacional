import Link from "next/link"
import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { PATHS } from "@/src/constants/paths"

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="font-serif text-4xl mb-6">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-6">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
        <div className="flex flex-col gap-4 text-foreground/90 leading-relaxed">
          <p>
            Esta política descreve como tratamos dados pessoais no site e na
            loja de e-books.
          </p>
          <h2 className="font-serif text-2xl mt-4">1. Dados que coletamos</h2>
          <p>
            Nome, e-mail, dados de sessão/autenticação e informações de compra
            processadas pela Stripe. Não armazenamos números completos de
            cartão.
          </p>
          <h2 className="font-serif text-2xl mt-4">2. Finalidade</h2>
          <p>
            Criar e gerenciar a conta, processar pagamentos, entregar downloads
            e cumprir obrigações legais.
          </p>
          <h2 className="font-serif text-2xl mt-4">3. Compartilhamento</h2>
          <p>
            Utilizamos prestadores necessários ao serviço (ex.: Stripe, Vercel,
            Neon/Postgres, Google OAuth). Não vendemos seus dados.
          </p>
          <h2 className="font-serif text-2xl mt-4">4. Retenção</h2>
          <p>
            Mantemos os dados enquanto a conta existir ou for necessário para
            histórico de compras e obrigações legais.
          </p>
          <h2 className="font-serif text-2xl mt-4">5. Direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos dados pelo
            e-mail{" "}
            <a href="mailto:tovitoriamoreira@gmail.com" className="text-primary">
              tovitoriamoreira@gmail.com
            </a>
            .
          </p>
          <p>
            Veja também os{" "}
            <Link href={PATHS.termos} className="text-primary underline">
              Termos de Uso
            </Link>
            .
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
