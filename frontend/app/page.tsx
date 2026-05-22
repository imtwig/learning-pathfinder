import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] relative overflow-hidden">
      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-500))] to-transparent opacity-60"></div>

      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[rgb(var(--color-primary-600))] opacity-[0.02] blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[rgb(var(--color-accent-600))] opacity-[0.02] blur-3xl"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-[var(--space-6)] py-8 sm:py-[var(--space-16)] lg:py-[var(--space-24)] relative">
        <div className="max-w-6xl mx-auto">

          {/* Hero Header */}
          <header className="text-center mb-12 sm:mb-[var(--space-20)] animate-fadeInUp">
            <div className="inline-flex items-center gap-[var(--space-2)] mb-6 sm:mb-[var(--space-8)]">
              <div className="h-px w-12 bg-[rgb(var(--color-border))]"></div>
              <Badge
                variant="outline"
                className="text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border))] px-4 py-2 text-xs uppercase tracking-[var(--tracking-widest)] font-medium"
              >
                Professional Development
              </Badge>
              <div className="h-px w-12 bg-[rgb(var(--color-border))]"></div>
            </div>

            <h1 className="font-serif text-4xl sm:text-[length:var(--text-6xl)] lg:text-[clamp(3.5rem,8vw,5.5rem)] font-bold text-[rgb(var(--color-text-primary))] mb-6 sm:mb-[var(--space-8)] leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)]">
              Learning<br />
              <span className="text-[rgb(var(--color-primary-600))] relative inline-block">
                Pathway
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-[length:var(--text-xl)] text-[rgb(var(--color-text-secondary))] leading-[var(--leading-relaxed)] max-w-3xl mx-auto font-light px-4">
              A sanctuary for professional growth: from foundational requirements through mastery, with oversight and recognition at every milestone.
            </p>
          </header>

          {/* Role Access Cards */}
          <section className="mb-12 sm:mb-[var(--space-20)] animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="text-center mb-8 sm:mb-[var(--space-12)]">
              <h2 className="font-serif text-2xl sm:text-[length:var(--text-3xl)] font-bold text-[rgb(var(--color-text-primary))] mb-3 sm:mb-[var(--space-3)]">
                Enter the Sanctuary
              </h2>
              <p className="text-[rgb(var(--color-text-secondary))] text-base sm:text-[length:var(--text-lg)]">
                Choose your role to access your personalized learning dashboard
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-[var(--space-8)] max-w-4xl mx-auto">
              {/* Staff Card */}
              <Link href="/staff?userId=staff-1" className="group block">
                <Card className="h-full hover:shadow-[var(--shadow-lg)] transition-all duration-300 bg-[rgb(var(--color-surface))] overflow-hidden relative">
                  <CardHeader className="text-center pt-[var(--space-10)] pb-[var(--space-8)] relative">
                    <div className="mb-[var(--space-6)] flex justify-center">
                      <div className="w-20 h-20 rounded-3xl bg-[rgb(var(--color-neutral-100))] flex items-center justify-center text-[rgb(var(--color-text-primary))] transform group-hover:scale-110 transition-transform duration-300 shadow-[var(--shadow-base)]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    </div>
                    <CardTitle className="font-serif text-[length:var(--text-3xl)] text-[rgb(var(--color-text-primary))]">Staff</CardTitle>
                  </CardHeader>
                  <div className="px-[var(--space-8)] pb-[var(--space-8)]">
                    <Button className="w-full bg-[rgb(var(--color-primary-600))] hover:bg-[rgb(var(--color-primary-700))] text-white py-[var(--space-4)] text-[length:var(--text-base)] font-medium rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all">
                      Enter as Staff
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Button>
                  </div>
                </Card>
              </Link>

              {/* Manager Card */}
              <Link href="/manager?userId=manager-1" className="group block">
                <Card className="h-full hover:shadow-[var(--shadow-lg)] transition-all duration-300 bg-[rgb(var(--color-surface))] overflow-hidden relative">
                  <CardHeader className="text-center pt-[var(--space-10)] pb-[var(--space-8)] relative">
                    <div className="mb-[var(--space-6)] flex justify-center">
                      <div className="w-20 h-20 rounded-3xl bg-[rgb(var(--color-neutral-100))] flex items-center justify-center text-[rgb(var(--color-text-primary))] transform group-hover:scale-110 transition-transform duration-300 shadow-[var(--shadow-base)]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <CardTitle className="font-serif text-[length:var(--text-3xl)] text-[rgb(var(--color-text-primary))]">Manager</CardTitle>
                  </CardHeader>
                  <div className="px-[var(--space-8)] pb-[var(--space-8)]">
                    <Button className="w-full bg-[rgb(var(--color-primary-600))] hover:bg-[rgb(var(--color-primary-700))] text-white py-[var(--space-4)] text-[length:var(--text-base)] font-medium rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all">
                      Enter as Manager
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Button>
                  </div>
                </Card>
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent"></div>
    </div>
  );
}
