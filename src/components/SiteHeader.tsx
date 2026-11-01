"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Twitter, X, Youtube } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/impact", label: "Impact" },
];

export default function SiteHeader() {
    const pathname = usePathname();
    const drawer = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const closeDrawer = () => drawer.current?.close();

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const desktop = window.matchMedia("(min-width: 768px)");
        const closeOnDesktop = () => { if (desktop.matches) drawer.current?.close(); };
        desktop.addEventListener("change", closeOnDesktop);
        closeOnDesktop();
        return () => {
            document.body.style.overflow = previousOverflow;
            desktop.removeEventListener("change", closeOnDesktop);
        };
    }, [isOpen]);

    const navigation = (mobile = false) => <nav aria-label={mobile ? "Mobile primary" : "Primary"} className={mobile ? "grid gap-2" : "flex items-center gap-6"}>
        {links.map(link => <Link key={link.href} href={link.href} onClick={closeDrawer}
            aria-current={pathname === link.href ? "page" : undefined}
            className={`inline-flex min-h-12 items-center border-b-2 py-3 font-heading text-base font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${mobile ? "px-4" : "px-1"} ${pathname === link.href ? "border-primary text-primary" : "border-transparent text-dark/80 hover:text-primary"}`}>
            {link.label}
        </Link>)}
    </nav>;

    const socials = <div className="flex items-center gap-3">
        <a href="https://x.com/techandsunhubs" aria-label="Tech and Sun on X" target="_blank" rel="noopener noreferrer" onClick={closeDrawer} className={buttonStyles({ variant: "text" })}><Twitter className="h-6 w-6" aria-hidden="true" /></a>
        <a href="https://www.youtube.com/@TechandSunHubs" aria-label="Tech and Sun on YouTube" target="_blank" rel="noopener noreferrer" onClick={closeDrawer} className={buttonStyles({ variant: "text" })}><Youtube className="h-6 w-6" aria-hidden="true" /></a>
    </div>;

    return <header className="absolute inset-x-0 top-0 z-50" data-testid="site-header">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-6">
            <Link href="/" aria-label="Tech and Sun home" className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <Image src="/Tas Logo-green.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full" priority />
            </Link>
            <div className="hidden items-center gap-6 md:flex">{navigation()}{socials}</div>
            <button type="button" aria-label="Open navigation menu" aria-expanded={isOpen} aria-controls="site-navigation-drawer" aria-haspopup="dialog"
                className={buttonStyles({ variant: "text", className: "md:hidden" })}
                onClick={() => { drawer.current?.showModal(); setIsOpen(true); }}>
                <Menu className="h-6 w-6" aria-hidden="true" /><span>Menu</span>
            </button>
        </div>
        <dialog ref={drawer} id="site-navigation-drawer" aria-labelledby="site-navigation-title" data-lenis-prevent
            className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-sm overflow-y-auto border-0 bg-vibrant p-6 text-dark shadow-2xl backdrop:bg-dark/50"
            onClose={() => setIsOpen(false)}
            onClick={event => {
                if (event.target !== event.currentTarget) return;
                const box = event.currentTarget.getBoundingClientRect();
                if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDrawer();
            }}>
            <div className="mb-8 flex items-center justify-between gap-4">
                <h2 id="site-navigation-title" className="font-heading text-xl font-bold">Explore Tech &amp; Sun</h2>
                <button type="button" onClick={closeDrawer} aria-label="Close navigation menu" className={buttonStyles({ variant: "text" })}><X className="h-6 w-6" aria-hidden="true" /></button>
            </div>
            {navigation(true)}
            <div className="mt-8 border-t border-primary/15 pt-6">{socials}</div>
            <a href="#contact" onClick={closeDrawer} className={buttonStyles({ className: "mt-8 w-full" })}>Partner with TAS</a>
        </dialog>
    </header>;
}
