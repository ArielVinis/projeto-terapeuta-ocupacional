"use client";

import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PATHS } from "@/src/constants/paths";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const footerLinks = {
  servicos: [
    { name: "Avaliação Inicial", href: PATHS.hash.servicos },
    { name: "Terapia Individual", href: PATHS.hash.servicos },
    { name: "Orientação Familiar", href: PATHS.hash.servicos },
  ],
  sobre: [
    { name: "Sobre Mim", href: PATHS.hash.sobre },
    { name: "Abordagem", href: PATHS.hash.sobre },
    { name: "Materiais", href: PATHS.shop },
  ],
  contato: [
    { name: "Agendar Consulta", href: PATHS.hash.agendar },
    { name: "WhatsApp", href: "https://wa.me/555596867402" },
    { name: "Localização", href: PATHS.hash.agendar },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[120px] sm:text-[160px] md:text-[240px] lg:text-[300px] font-bold text-primary/5 whitespace-nowrap leading-none">
          Vitoria
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-2xl text-foreground mb-2">
              <span className="text-primary">Vitoria</span> Moreira
            </h2>
            <p className="text-xs text-primary mb-4">
              Terapeuta Ocupacional - CREFITO
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Cuidando do desenvolvimento infantil com amor, dedicação e
              profissionalismo.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/vitoriamoreira.to"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 vivi-transition vivi-shadow"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="mailto:tovitoriamoreira@gmail.com"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 vivi-transition vivi-shadow"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="https://wa.me/555596867402"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 vivi-transition vivi-shadow"
                aria-label="WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Servicos Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Serviços</h3>
            <ul className="space-y-3">
              {footerLinks.servicos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary vivi-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Sobre</h3>
            <ul className="space-y-3">
              {footerLinks.sobre.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary vivi-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato Links */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-medium text-foreground mb-4">Contato</h3>
            <ul className="space-y-3">
              {footerLinks.contato.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary vivi-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="shrink-0 size-4" />
              <span className="whitespace-nowrap">
                Atendimento presencial e online
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Vitoria Moreira. Todos os
              direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href={PATHS.privacidade}
                className="text-sm text-muted-foreground hover:text-primary vivi-transition"
              >
                Política de Privacidade
              </Link>
              <Link
                href={PATHS.termos}
                className="text-sm text-muted-foreground hover:text-primary vivi-transition"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
