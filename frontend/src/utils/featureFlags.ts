/**
 * Feature Flag Utility
 * - Mobile Devices: Supports URL parameter (?v2=true / ?v2=false) for easy mobile testing.
 * - Desktop Devices: Strictly checks browser cookie ('v2_features_enabled=true') or enableV2Features() command.
 */

const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    return userAgentMobile || isSmallScreen;
};

export const isV2Enabled = (): boolean => {
    try {
        if (typeof window === 'undefined' || typeof document === 'undefined') return false;

        // 1. Mobile Devices ONLY: Allow URL parameter (?v2=true / ?v2=false) to enable/disable features
        if (isMobileDevice()) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('v2') === 'true' || urlParams.get('v2_enabled') === 'true') {
                document.cookie = "v2_features_enabled=true; path=/; max-age=31536000";
                localStorage.setItem('v2_features_enabled', 'true');
                return true;
            }
            if (urlParams.get('v2') === 'false' || urlParams.get('v2_enabled') === 'false') {
                document.cookie = "v2_features_enabled=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                localStorage.removeItem('v2_features_enabled');
                return false;
            }
        }

        // 2. Desktop Devices (or default): Strictly check browser cookie ('v2_features_enabled=true')
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].trim().split('=');
            if ((name === 'v2_features_enabled' || name === 'drive_easy_v2') && value === 'true') {
                return true;
            }
        }

        // 3. Fallback check localStorage
        if (localStorage.getItem('v2_features_enabled') === 'true' || localStorage.getItem('drive_easy_v2') === 'true') {
            return true;
        }
    } catch {
        return false;
    }
    return false;
};

// Global helper for browser console testing
if (typeof window !== 'undefined') {
    (window as any).enableV2Features = () => {
        document.cookie = "v2_features_enabled=true; path=/; max-age=31536000";
        localStorage.setItem('v2_features_enabled', 'true');
        console.log("🚀 V2 Features Enabled! Refreshing...");
        window.location.reload();
    };

    (window as any).disableV2Features = () => {
        document.cookie = "v2_features_enabled=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('v2_features_enabled');
        console.log("🛑 V2 Features Disabled! Refreshing...");
        window.location.reload();
    };
}
