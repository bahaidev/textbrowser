export function setServiceWorkerDefaults(target: Partial<ServiceWorkerConfig>, source: Partial<ServiceWorkerConfig>): ServiceWorkerConfig;
export function listenForWorkerUpdate({ r }: {
    r: ServiceWorkerRegistration;
}): void;
export function respondToState({ r, logger }: {
    r: ServiceWorkerRegistration;
    logger: Logger;
}): Promise<any>;
export function registerServiceWorker({ serviceWorkerPath, logger }: {
    serviceWorkerPath: string;
    logger: Logger;
}): Promise<any>;
export type ServiceWorkerConfig = {
    userJSON: string;
    languages: string;
    serviceWorkerPath: string;
    files: string;
    namespace: string;
    stylesheets?: string[];
};
export type Logger = {
    addLogEntry: (entry: {
        text: string;
    }) => void;
};
//# sourceMappingURL=ServiceWorker.d.ts.map