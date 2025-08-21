export interface BeanHeadProps {
    size?: number | string;
    accessory?: "none" | "roundGlasses" | "tinyGlasses" | "shades";
    body?: "chest" | "breasts";
    circleColor?: "blue";
    clothing?: "naked" | "shirt" | "dressShirt" | "vneck" | "tankTop" | "dress";
    clothingColor?: "white" | "blue" | "black" | "green" | "red";
    eyebrows?: "raised" | "leftLowered" | "serious" | "angry" | "concerned";
    eyes?:
        | "normal"
        | "leftTwitch"
        | "happy"
        | "content"
        | "squint"
        | "simple"
        | "dizzy"
        | "wink"
        | "heart";
    facialHair?: "none" | "none2" | "none3" | "stubble" | "mediumBeard";
    graphic?: "none" | "redwood" | "gatsby" | "vue" | "react" | "graphQL";
    hair?: "none" | "long" | "bun" | "short" | "pixie" | "balding" | "buzz" | "afro" | "bob";
    hairColor?: "blonde" | "orange" | "black" | "white" | "brown" | "blue" | "pink";
    hat?: "none" | "none2" | "none3" | "none4" | "none5" | "beanie" | "turban";
    hatColor?: "white" | "blue" | "black" | "green" | "red";
    lashes?: boolean;
    lipColor?: "red" | "purple" | "pink" | "turqoise" | "green";
    mask?: boolean;
    faceMask?: boolean;
    mouth?: "grin" | "sad" | "openSmile" | "lips" | "open" | "serious" | "tongue";
    skinTone?: "light" | "yellow" | "brown" | "dark" | "red" | "black";
    [key: string]: unknown;
}

/* 官方全部枚举值（与文档 1:1 对应） */
const ENUMS = {
    accessory: ["none", "roundGlasses", "tinyGlasses", "shades"] as const,
    body: ["chest", "breasts"] as const,
    circleColor: ["blue"] as const,
    clothing: ["naked", "shirt", "dressShirt", "vneck", "tankTop", "dress"] as const,
    clothingColor: ["white", "blue", "black", "green", "red"] as const,
    eyebrows: ["raised", "leftLowered", "serious", "angry", "concerned"] as const,
    eyes: [
        "normal",
        "leftTwitch",
        "happy",
        "content",
        "squint",
        "simple",
        "dizzy",
        "wink",
        "heart",
    ] as const,
    facialHair: ["none", "none2", "none3", "stubble", "mediumBeard"] as const,
    graphic: ["none", "redwood", "gatsby", "vue", "react", "graphQL"] as const,
    hair: ["none", "long", "bun", "short", "pixie", "balding", "buzz", "afro", "bob"] as const,
    hairColor: ["blonde", "orange", "black", "white", "brown", "blue", "pink"] as const,
    hat: ["none", "none2", "none3", "none4", "none5", "beanie", "turban"] as const,
    hatColor: ["white", "blue", "black", "green", "red"] as const,
    lashes: [false, true] as const,
    lipColor: ["red", "purple", "pink", "turqoise", "green"] as const,
    mask: [false, true] as const,
    faceMask: [false, true] as const,
    mouth: ["grin", "sad", "openSmile", "lips", "open", "serious", "tongue"] as const,
    skinTone: ["light", "yellow", "brown", "dark", "red", "black"] as const,
} as const;

/* 随机抽一个元素 */
const pick = <T extends readonly string[] | readonly boolean[]>(arr: T): T[number] =>
    arr[Math.floor(Math.random() * arr.length)] as T[number];

/* 一键生成完整头像（19 个字段全部随机） */
export default function randomBeanHead(): BeanHeadProps {
    return {
        accessory: pick(ENUMS.accessory),
        body: pick(ENUMS.body),
        circleColor: pick(ENUMS.circleColor),
        clothing: pick(ENUMS.clothing),
        clothingColor: pick(ENUMS.clothingColor),
        eyebrows: pick(ENUMS.eyebrows),
        eyes: pick(ENUMS.eyes),
        facialHair: pick(ENUMS.facialHair),
        graphic: pick(ENUMS.graphic),
        hair: pick(ENUMS.hair),
        hairColor: pick(ENUMS.hairColor),
        hat: pick(ENUMS.hat),
        hatColor: pick(ENUMS.hatColor),
        lashes: pick(ENUMS.lashes),
        lipColor: pick(ENUMS.lipColor),
        mask: pick(ENUMS.mask),
        faceMask: pick(ENUMS.faceMask),
        mouth: pick(ENUMS.mouth),
        skinTone: pick(ENUMS.skinTone),
    };
}
