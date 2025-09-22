
import type { SVGProps } from 'react';
import Link from 'next/link';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <Link href="/" aria-label="CP.cpp Logo - Go to Dashboard">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 50"
        width="100"
        height="25"
        // aria-label is now on the Link component
        {...props}
      >
        <style>
          {`
            .codetrack-text {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 38px;
              font-weight: bold;
              fill: hsl(var(--sidebar-foreground));
            }
            .codetrack-highlight { fill: hsl(var(--sidebar-primary)); }

            @media (prefers-color-scheme: dark) {
              .codetrack-text { fill: hsl(var(--sidebar-foreground)); }
              .codetrack-highlight { fill: hsl(var(--sidebar-primary)); }
            }
          `}
        </style>
        <text x="10" y="38" className="codetrack-text">
          CP.<tspan className="codetrack-highlight">cpp</tspan>
        </text>
      </svg>
    </Link>
  );
}
