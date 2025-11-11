import type { ReactElement } from "react"
import { Button } from "@/components/ui/button"
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    handle: "@handmade.market",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    handle: "/handmade.market",
    icon: Facebook,
  },
  {
    name: "Email",
    href: "mailto:hello@handmademarket.com",
    handle: "hello@handmademarket.com",
    icon: Mail,
  },
]

function ContactPage(): ReactElement {
  return (
    <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-secondary/40 text-foreground">
      <section className="border-b border-border/70 bg-background/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center sm:py-20">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Let&apos;s connect
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            We’d love to hear from you.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
            Whether you’re curating a new collection or have a question about partnering,
            drop us a note. We typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
        <div className="space-y-8">
          <div className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <MapPin className="size-4" />
              Find our studio
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
              <iframe
                title="Handmade Market Studio Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.930332776689!2d-73.9653552235726!3d40.71775073800853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25e6b0a8e5b0f%3A0x9cec2c11591eda5f!2sBrooklyn%20Flea!5e0!3m2!1sen!2sus!4v1730407044284!5m2!1sen!2sus"
                loading="lazy"
                allowFullScreen
                className="h-[320px] w-full border-0"
              />
            </div>
            <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em]">Studio hours</p>
                <p className="mt-1 font-medium text-foreground">
                  Wed – Sat · 11:00 – 18:00
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em]">Phone</p>
                <a
                  className="mt-1 inline-flex items-center gap-2 font-medium text-foreground transition hover:text-primary"
                  href="tel:+13475551234"
                >
                  <Phone className="size-4" />
                  +1 (347) 555-1234
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Follow along</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Showcase new arrivals, maker spotlights, and behind-the-scenes workshop
              moments across our channels.
            </p>
            <ul className="mt-6 space-y-3">
              {socials.map(({ name, href, handle, icon: Icon }) => (
                <li key={name}>
                  <a
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/60 hover:text-foreground"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="size-4 text-primary" />
                    <span className="flex-1">{name}</span>
                    <span className="text-xs uppercase tracking-[0.2em]">
                      {handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-background/90 p-6 shadow-lg lg:mt-0">
          <h2 className="text-lg font-semibold">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form and one of our curators will get back to you shortly.
          </p>
          <form className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@brandstudio.com"
                className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="How can we collaborate?"
                className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Send message
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ContactPage

