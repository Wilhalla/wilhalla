export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-nav mb-4">Contact</h3>
            <address className="text-small not-italic text-muted-foreground leading-relaxed">
              Wilhalla<br />
              {/* Address TBD from CMS */}
            </address>
          </div>
          <div>
            <h3 className="text-nav mb-4">Openingsuren</h3>
            <p className="text-small text-muted-foreground">
              {/* Hours TBD from CMS */}
            </p>
          </div>
          <div>
            <h3 className="text-nav mb-4">Volg ons</h3>
            <div className="flex gap-4">
              {/* Social links TBD */}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-small text-muted-foreground italic">
            Wilhalla — Velt-ecotuin sinds 1962
          </p>
        </div>
      </div>
    </footer>
  )
}
