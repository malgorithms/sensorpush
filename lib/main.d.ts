interface AuthorizeRes {
    authorization: string;
}
interface AccesstokenRes {
    accesstoken: string;
}
interface SensorsRes {
    [k: string]: {
        calibration: {
            humidity: number;
            temperature: number;
        };
        address: string;
        name: string;
        active: boolean;
        deviceId: string;
        id: string;
        battery_voltage: number;
        alerts: {
            temperature: {
                enabled: boolean;
                max?: number;
                min?: number;
            };
            humidity: {
                enabled: boolean;
                max?: number;
                min?: number;
            };
        };
    };
}
interface GatewaysRes {
    [k: string]: {
        name: string;
        last_alert: string;
        last_seen: string;
        version: string;
        message: null | string;
        paired: boolean;
    };
}
interface Sample {
    observed: string;
    temperature: number;
    humidity: number;
}
interface SamplesRes {
    last_time: string;
    sensors: {
        [k: string]: Sample[];
    };
    truncated: boolean;
    status: string;
    total_samples: number;
    total_sensors: number;
}
declare function authorize(email: string, password: string): Promise<AuthorizeRes>;
declare function accesstoken(authorization: string): Promise<AccesstokenRes>;
declare function gateways(accesstoken: string): Promise<GatewaysRes>;
declare function sensors(accesstoken: string): Promise<SensorsRes>;
declare function samples(accesstoken: string, startTime: Date, limit: number): Promise<SamplesRes>;
declare const api: {
    oauth: {
        authorize: typeof authorize;
        accesstoken: typeof accesstoken;
    };
    devices: {
        gateways: typeof gateways;
        sensors: typeof sensors;
    };
    samples: typeof samples;
};
export { api };
