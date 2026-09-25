import { useEffect, useState, useCallback } from 'react';
import { downloadPCDesktopInstaller } from '../utils/pcDesktopInstaller';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export type DirectInstallStatus =
  | 'pc_downloaded'
  | 'prompted_accepted'
  | 'prompted_dismissed'
  | 'already_installed'
  | 'ios_safari'
  | 'browser_manual'
  | 'error';

export interface DirectInstallResult {
  status: DirectInstallStatus;
  message: string;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__pwaInstallPrompt) {
      return window.__pwaInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed on phone, tablet or PC)
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsPC(!isMobileDevice);

    // If window already had captured prompt, adopt it
    if (window.__pwaInstallPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      console.log('usePWAInstall: beforeinstallprompt event captured.');
    };

    const handlePromptAvailable = (e: CustomEvent<BeforeInstallPromptEvent>) => {
      if (e.detail) {
        setDeferredPrompt(e.detail);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__pwaInstallPrompt = null;
      console.log('usePWAInstall: appinstalled event fired.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-available', handlePromptAvailable as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  /**
   * Direct Install action without opening any modal dialog.
   * On PC: Directly downloads the PC installer & desktop shortcut package and triggers Chrome PWA prompt.
   * On Mobile: Directly prompts native Android/PWA sheet or iOS instructions.
   */
  const triggerDirectInstall = useCallback(async (): Promise<DirectInstallResult> => {
    // 1. Check if already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      isInstalled;

    if (isStandalone) {
      return {
        status: 'already_installed',
        message: 'Islamic Path ایپ پہلے سے آپ کے کمپیوٹر/ڈیوائس پر کامیابی سے انسٹال ہے۔'
      };
    }

    const promptEvent = deferredPrompt || window.__pwaInstallPrompt;

    // 2. Check if running on PC / Computer
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
    if (!isMobile) {
      // Trigger file download to PC immediately
      downloadPCDesktopInstaller();

      // If browser supports native desktop prompt, also prompt it
      if (promptEvent) {
        try {
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;
          if (choice && choice.outcome === 'accepted') {
            setIsInstalled(true);
            setDeferredPrompt(null);
            window.__pwaInstallPrompt = null;
            return {
              status: 'prompted_accepted',
              message: 'مبارک ہو! Islamic Path ایپ آپ کے کمپیوٹر پر کامیابی سے انسٹال ہو گئی ہے۔'
            };
          }
        } catch (err) {
          console.warn('PC native prompt error:', err);
        }
      }

      return {
        status: 'pc_downloaded',
        message: 'کمپیوٹر کے لیے انسٹالر فائل (IslamicPath-PC-Setup) کامیابی سے ڈاؤنلوڈ ہو گئی ہے!\nاپنے Downloads فولڈر سے فائل پر کلک کریں، یہ خودکار طور پر ڈیسک ٹاپ پر شارٹ کٹ بنا کر فل اسکرین ایپ کھول دے گی۔'
      };
    }

    // 3. Mobile Android / Chromium prompt
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          window.__pwaInstallPrompt = null;
          return {
            status: 'prompted_accepted',
            message: 'مبارک ہو! Islamic Path ایپ براہِ راست آپ کی ڈیوائس پر انسٹال ہو گئی۔'
          };
        } else {
          return {
            status: 'prompted_dismissed',
            message: 'انسٹالیشن منسوخ کر دی گئی۔ آپ دوبارہ کسی بھی وقت انسٹال کر سکتے ہیں۔'
          };
        }
      } catch (err) {
        console.warn('Native prompt failed:', err);
      }
    }

    // 4. iOS Safari
    if (isIOS) {
      return {
        status: 'ios_safari',
        message: 'iPhone/iPad پر انسٹال کے لیے: نیچے Share بٹن (⎋) دبائیں اور "Add to Home Screen" منتخب کریں۔'
      };
    }

    // 5. Fallback for mobile browser menu
    return {
      status: 'browser_manual',
      message: 'براؤزر کے مینو (تین نقطوں ⋮) پر کلک کر کے "Install App" یا "Add to Home screen" منتخب کریں۔'
    };
  }, [deferredPrompt, isInstalled, isIOS]);

  const install = async (): Promise<boolean> => {
    const res = await triggerDirectInstall();
    return res.status === 'prompted_accepted' || res.status === 'pc_downloaded';
  };

  return {
    isInstallable: !!(deferredPrompt || (typeof window !== 'undefined' && window.__pwaInstallPrompt)),
    isInstalled,
    isIOS,
    isPC,
    install,
    triggerDirectInstall,
    deferredPrompt,
  };
}
