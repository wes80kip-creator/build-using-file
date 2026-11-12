import React, { useState } from 'react';
import {
  Globe,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Code2,
  Cloud,
  Server,
  X,
  Share2,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DomainLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: string;
}

export const DomainLinkingModal: React.FC<DomainLinkingModalProps> = ({
  isOpen,
  onClose,
  currentTab = 'gigs',
}) => {
  const { addToast } = useApp();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cloudflare' | 'olitt' | 'deeplinks'>('cloudflare');

  if (!isOpen) return null;

  const customDomain = 'https://www.gigworksite.com';
  const sharedRunUrl = 'https://ais-pre-r4du7u5tzlzoja4vwa3vys-951950510633.europe-west2.run.app';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(label);
    addToast('Copied to Clipboard', text, 'affiliate');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const iframeSnippet = `<iframe
  src="${sharedRunUrl}"
  title="GIGWORK SITE Platform"
  style="width: 100%; height: 100vh; border: none; min-height: 100vh;"
  allow="camera; microphone; geolocation; payment">
</iframe>`;

  const deepLinks = [
    { label: 'Marketplace Home', tab: 'gigs', url: `${customDomain}/?tab=gigs` },
    { label: 'Remote Job Board', tab: 'jobs', url: `${customDomain}/?tab=jobs` },
    { label: 'Digital Skills Academy', tab: 'academy', url: `${customDomain}/?tab=academy` },
    { label: 'Membership Packages', tab: 'memberships', url: `${customDomain}/?tab=memberships` },
    { label: '15% Affiliate Rewards', tab: 'affiliate', url: `${customDomain}/?tab=affiliate` },
    { label: 'Orders & Escrow Vault', tab: 'orders', url: `${customDomain}/?tab=orders` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 relative border-b border-indigo-900/50 text-left">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-bold">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Verified Custom Domain
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Linked to App
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>https://www.gigworksite.com</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
            Your application is tuned and configured for your custom domain. Manage your Cloudflare SSL proxy, Olitt website builder embed, or deep navigation links below.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <button
              onClick={() => copyToClipboard(customDomain, 'domain')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {copiedType === 'domain' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'domain' ? 'Domain Copied!' : 'Copy Domain URL'}</span>
            </button>

            <a
              href={customDomain}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer"
            >
              <span>Visit www.gigworksite.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`flex items-center gap-1.5 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-500" />
            <span>Cloudflare SSL &amp; CNAME Fix</span>
          </button>
          <button
            onClick={() => setActiveTab('olitt')}
            className={`flex items-center gap-1.5 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'olitt'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Olitt Website Builder Embed</span>
          </button>
          <button
            onClick={() => setActiveTab('deeplinks')}
            className={`flex items-center gap-1.5 pb-3 px-3 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'deeplinks'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Deep Section Links</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-xs leading-relaxed">
          {/* Tab 1: Cloudflare SSL & CNAME Fix */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 text-sm">
                    Why Direct CNAME Handshake Fails (SSL Subject Mismatch)
                  </h4>
                  <p className="text-amber-800">
                    When <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">www.gigworksite.com</code> points directly as a DNS-only CNAME to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ais-pre-...run.app</code>, Google Cloud Run returns its default SSL certificate (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">*.a.run.app</code>), causing browsers to show <span className="font-bold underline decoration-amber-500">SSL: no alternative certificate subject name matches target host name</span>.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-400 text-xs uppercase tracking-wider">
                    The 1-Click Fix in Cloudflare DNS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    Orange Cloud = ON
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    1. Log into your <strong>Cloudflare Dashboard</strong> &rarr; Select <code className="text-teal-300">gigworksite.com</code> &rarr; Open <strong>DNS &gt; Records</strong>.
                  </p>
                  <p className="text-slate-300">
                    2. Locate the CNAME record for <code className="text-teal-300 font-mono">www</code> pointing to <code className="text-teal-300 font-mono">ais-pre-r4du7u5tzlzoja4vwa3vys-951950510633.europe-west2.run.app</code>.
                  </p>
                  <p className="text-slate-300">
                    3. Toggle <strong>Proxy Status</strong> to <span className="text-amber-400 font-bold">Proxied (Orange Cloud)</span> instead of DNS Only (Grey Cloud).
                  </p>
                  <p className="text-slate-300">
                    4. Under <strong>SSL/TLS</strong> in Cloudflare, set encryption to <span className="text-emerald-400 font-bold">Full</span>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
                  &bull; Cloudflare terminates SSL for www.gigworksite.com with a valid Universal Edge Certificate.<br/>
                  &bull; Visitors instantly load your app with zero SSL errors and full CDN acceleration!
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Olitt Website Builder Embed */}
          {activeTab === 'olitt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-900 text-sm">
                    How to Host at Olitt Servers via HTML Widget
                  </h4>
                  <p className="text-indigo-800">
                    If you are building your site with Olitt&apos;s drag-and-drop website builder on <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">www.gigworksite.com</code>, you can render your entire interactive application seamlessly using a full-viewport responsive embed.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Olitt Custom Code Embed Snippet:</span>
                  <button
                    onClick={() => copyToClipboard(iframeSnippet, 'snippet')}
                    className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold text-xs cursor-pointer"
                  >
                    {copiedType === 'snippet' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'snippet' ? 'Snippet Copied' : 'Copy HTML Snippet'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                  {iframeSnippet}
                </pre>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                <li>Log in to your <strong>Olitt</strong> dashboard.</li>
                <li>Open your <strong>gigworksite.com</strong> project in the editor.</li>
                <li>Add a <strong>Custom Code / HTML</strong> block to your page.</li>
                <li>Paste the snippet above and click <strong>Save &amp; Publish</strong>.</li>
              </ol>
            </div>
          )}

          {/* Tab 3: Deep Section Links */}
          {activeTab === 'deeplinks' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                The application now natively parses URL parameters. You can share direct links to any marketplace section on <strong className="text-slate-900">www.gigworksite.com</strong>:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {deepLinks.map(link => (
                  <div
                    key={link.tab}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">{link.label}</div>
                      <div className="font-mono text-[11px] text-teal-700 select-all">{link.url}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(link.url, link.tab)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-teal-500 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0 ml-2"
                    >
                      {copiedType === link.tab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === link.tab ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>SEO canonicals, OpenGraph &amp; sitemaps linked to gigworksite.com</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
