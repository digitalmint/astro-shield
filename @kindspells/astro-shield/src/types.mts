import type { AstroConfig } from 'astro'

// Options
// -----------------------------------------------------------------------------
// We don't include 'script-src' and 'style-src' because they are handled by the
// integration itself.
export type CSPDirectiveNames =
	| 'base-uri'
	| 'child-src'
	| 'connect-src'
	| 'default-src'
	| 'font-src'
	| 'form-action'
	| 'frame-ancestors'
	| 'frame-src'
	| 'img-src'
	| 'manifest-src'
	| 'media-src'
	| 'object-src'
	| 'plugin-types'
	| 'prefetch-src'
	| 'require-trusted-types-for'
	| 'sandbox'
	| 'script-src'
	| 'style-src'
	| 'worker-src'

export type CSPDirectives = { [k in CSPDirectiveNames]?: string }

export type CSPOptions = {
	/**
	 * - If set to `all`, the `script-src` and `style-src` directives will include
	 *   all known SRI hashes (independently of whether the associated asset is
	 *   referenced in the page or not). This can be useful to avoid problems with
	 *   the View Transitions feature.
	 * - If set to `perPage`, the `script-src` and `style-src` directives will
	 *   include only the SRI hashes of the assets referenced in the page. This is
	 *   more secure and efficient, but it can cause problems with the View
	 *   Transitions feature.
	 *
	 * Defaults to `all`.
	 */

	/**
	 * - If set, it controls the "default" CSP directives (they can be overriden
	 *   at runtime).
	 * - If not set, the middleware will use a minimal set of default directives.
	 */
	cspDirectives?: CSPDirectives

	// TODO:
	// perPageCspDirectives?: Record<string, CSPDirectives>
}

export type SRIOptions = {
	/**
	 * When set to `true`, `@kindspells/astro-shield` will generate Subresource
	 * Integrity (SRI) hashes for all assets referenced in static HTML pages.
	 *
	 * Defaults to `true`.
	 */
	enableStatic?: boolean

	/**
	 * When set to `true`, `@kindspells/astro-shield` will generate Subresource
	 * Integrity (SRI) hashes for all assets referenced in dynamic pages by
	 * enabling a middleware that will inject the SRI hashes into the generated
	 * HTML.
	 *
	 * Defaults to `false`.
	 */
	enableMiddleware?: boolean

	/**
	 * Specifies the path for the auto-generated module that will contain the SRI
	 * hashes. Note that:
	 * - The generated module will be an ESM module
	 * - The generated module should be treated as source code, and not as a build
	 *   artifact.
	 */
	hashesModule?: string | undefined

	/**
	 * Inline styles are usually considered unsafe because they could make it
	 * easier for an attacker to inject CSS rules in dynamic pages. However, they
	 * don't pose a serious security risk for _most_ static pages.
	 *
	 * You can disable this option in case you want to enforce a stricter policy.
	 *
	 * Defaults to 'all'.
	 */
	allowInlineStyles?: 'all' | 'static' | false

	/**
	 * Inline scripts are usually considered unsafe because they could make it
	 * easier for an attacker to inject JS code in dynamic pages. However, they
	 * don't pose a serious security risk for _most_ static pages.
	 *
	 * You can disable this option in case you want to enforce a stricter policy.
	 *
	 * Defaults to 'all'.
	 */
	allowInlineScripts?: 'all' | 'static' | false

	/**
	 * Cross-Origin scripts must be explicitly allow-listed by URL in order to be
	 * allowed by the Content Security Policy.
	 */
	scriptsAllowListUrls?: string[]

	/**
	 * Cross-Origin styles must be explicitly allow-listed by URL in order to be
	 * allowed by the Content Security Policy.
	 */
	stylesAllowListUrls?: string[]
}

type NetlifyConfig = { provider: 'netlify' }
type VercelConfig = { provider: 'vercel' }

export type SecurityHeadersOptions = {
	enableOnStaticPages?: NetlifyConfig | VercelConfig | undefined

	/**
	 * - If set, it controls how the CSP (Content Security Policy) header will be
	 *   generated in the middleware.
	 * - If not set, no CSP header will be generated.
	 *
	 * Defaults to `undefined`.
	 */
	contentSecurityPolicy?: CSPOptions | undefined

	/**
	 * - If set, it will remove the `.html` extension from the URLs.
	 * 
	 * Defaults to `false`.
	 */
	removeHtmlExtension?: boolean
}

export type ShieldOptions = {
	/**
	 * When set to `true`, the transformation of static pages will be delayed to
	 * be executed as late as possible in the build process. This might be
	 * necessary in case you are using many integrations that transform the HTML
	 * output.
	 *
	 * If not set and any of the following conditions are met, then this option
	 * will be automatically set to `true`:
	 * - securityHeaders.enableOnStaticPages is set to `{ provider: 'vercel' }`
	 *
	 * Defaults to `false`.
	 */
	delayTransform?: boolean

	/**
	 * Options related to Subresource Integrity (SRI).
	 */
	sri?: SRIOptions | undefined

	/**
	 * - If set, it controls how the security headers will be generated in the
	 *   middleware.
	 * - If not set, no security headers will be generated in the middleware.
	 *
	 * Defaults to `undefined`.
	 */
	securityHeaders?: SecurityHeadersOptions | undefined
}

export type StrictShieldOptions = ShieldOptions & {
	state: IntegrationState
	distDir: string
	sri: SRIOptions & { enableStatic: boolean; enableMiddleware: boolean }
}

export type Logger = {
	info(msg: string): void
	warn(msg: string): void
	error(msg: string): void
}

export type MiddlewareHashes = {
	scripts: Map<string, string>
	styles: Map<string, string>
}

export type PerPageHashes = { scripts: Set<string>; styles: Set<string> }
export type PerPageHashesCollection = Map<string, PerPageHashes>

export type HashesCollection = {
	inlineScriptHashes: Set<string>
	inlineStyleHashes: Set<string>
	extScriptHashes: Set<string>
	extStyleHashes: Set<string>
	perPageSriHashes: PerPageHashesCollection
	perResourceSriHashes: MiddlewareHashes
}

export type IntegrationState = {
	delayTransform: boolean
	config: Partial<AstroConfig>
}
