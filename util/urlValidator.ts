import { Types } from "mongoose";

type SupportedPlatforms = "youtube" | "soundcloud";

interface PlatformValidator {
    validate(url: string): boolean;
}

class YouTubeValidator implements PlatformValidator {
    validate(url: string): boolean {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return youtubeRegex.test(url);
    }
}

class SoundCloudValidator implements PlatformValidator {
    validate(url: string): boolean {
        const soundcloudRegex = /^(https?:\/\/)?(www\.)?(soundcloud\.com)\/.+$/;
        return soundcloudRegex.test(url);
    }
}

export class UrlValidator {
    private platformValidators: Map<SupportedPlatforms, PlatformValidator> =
        new Map();

    constructor() {
        this.registerValidator("youtube", new YouTubeValidator());
        this.registerValidator("soundcloud", new SoundCloudValidator());
    }

    registerValidator(
        platform: SupportedPlatforms,
        validator: PlatformValidator
    ): void {
        this.platformValidators.set(platform, validator);
    }

    validate(url: string): boolean {
        for (const validator of this.platformValidators.values()) {
            if (validator.validate(url)) {
                return true;
            }
        }
        return false;
    }
}

export function convertToObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
}
