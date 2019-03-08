// typescript < 2.8 does not include those

interface HTMLElement { 
    animate(keyframes: AnimationKeyFrame | AnimationKeyFrame[], options: number | AnimationOptions): Animation;
}

interface AnimationKeyFrame {
    easing?: string | string[];
    offset?: number | null | (number | null)[];
    [index: string]: string | number | number[] | string[] | null | (number | null)[] | undefined;
}

interface AnimationOptions {
    delay?: number;
    direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
    duration?: number;
    easing?: string;
    endDelay?: number;
    fill?: "none" | "forwards" | "backwards" | "both" | "auto";
    id?: string;
    iterationStart?: number;
    iterations?: number;
}