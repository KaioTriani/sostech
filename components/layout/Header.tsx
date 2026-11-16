"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { useCart, useUi } from "@/lib/store";
import { useHydrated, useLockBody, useScrolled } from "@/lib/hooks";
import { cx } from "@/lib/format";
import { site, waLink, WA_GERAL } from "@/lib/site";

export const nav = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/loja?grupo=smartphones", label: "Smartphones" },
  { href: "/loja?grupo=acessorios", label: "Acessórios" },
  { href: "/assistencia", label: "Assistência Técnica" },
  { href: "/#sobre", label: "Sobre Nós" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const scrolled = useScrolled(16);
  const pathname = usePathname();
  const { setCart, setSearch, menuOpen, setMenu, bump } = useUi();
  const count = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const hydrated = useHydrated();
  useLockBody(menuOpen);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
      >
        <div
          className={cx(
            "transition-all duration-500",
            scrolled ? "border-b border-white/[0.07] bg-[#050505]/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent",
          )}
        >
          <div className={cx("container-x flex items-center justify-between gap-4 transition-all duration-500", scrolled ? "h-16" : "h-20")}>
            <Logo size={scrolled ? 38 : 44} />

            <nav aria-label="Principal" className="hidden items-center gap-1 xl:flex">
              {nav.map((n) => {
                const active = n.href === "/" ? pathname === "/" : pathname === n.href.split("?")[0] && !n.href.includes("#");
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cx(
                      "relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition",
                      active ? "text-white" : "text-white/60 hover:text-white",
                    )}
                  >
                    {n.label}
                    {active && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 mx-auto h-px bg-gradient-to-r from-transparent via-brand-bright to-transparent" />}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <IconBtn label="Pesquisar" onClick={() => setSearch(true)}>
                <Search className="h-[19px] w-[19px]" />
              </IconBtn>
              <IconBtn label="Abrir carrinho" onClick={() => setCart(true)}>
                <motion.span key={bump} animate={bump ? { scale: [1, 1.35, 0.9, 1], rotate: [0, -12, 8, 0] } : {}} transition={{ duration: 0.6 }} className="grid place-items-center">
                  <ShoppingBag className="h-[19px] w-[19px]" />
                </motion.span>
                {hydrated && count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-bright px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-[#050505]">
                    {count}
                  </span>
                )}
              </IconBtn>
              <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className="btn-wa ml-1 hidden !min-h-[42px] !px-4 text-[13.5px] md:inline-flex">
                <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp
              </a>
              <IconBtn label="Abrir menu" onClick={() => setMenu(true)} className="xl:hidden">
                <Menu className="h-5 w-5" />
              </IconBtn>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[70] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMenu(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto rounded-b-[2rem] border-b border-white/10 bg-[#0a0a0a] pb-8 pt-[env(safe-area-inset-top)]"
            >
              <div className="container-x flex h-20 items-center justify-between">
                <Logo />
                <IconBtn label="Fechar menu" onClick={() => setMenu(false)}>
                  <X className="h-5 w-5" />
                </IconBtn>
              </div>
              <nav aria-label="Menu mobile" className="container-x mt-2 grid">
                {nav.map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.04 }}>
                    <Link
                      href={n.href}
                      onClick={() => setMenu(false)}
                      className="flex items-center justify-between border-b border-white/[0.06] py-4 font-display text-[22px] font-semibold tracking-tight text-white/90 active:text-brand-bright"
                    >
                      {n.label}
                      <ArrowUpRight className="h-5 w-5 text-white/30" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="container-x mt-6 grid grid-cols-2 gap-3">
                <a href={waLink(WA_GERAL)} target="_blank" rel="noopener" className="btn-wa">
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a href={site.instagram} target="_blank" rel="noopener" className="btn-ghost">
                  <InstagramIcon /> Instagram
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ children, label, onClick, className }: { children: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        "relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/85 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}
