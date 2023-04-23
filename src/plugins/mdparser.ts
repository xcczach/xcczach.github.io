const regExps = {
    h1: /^#\s+(.+)/,
    h2: /^#{2}\s+(.+)/,
    h3: /^#{3}\s+(.+)/,
    h4: /^#{4}\s+(.+)/,
    h5: /^#{5}\s+(.+)/,
    h6: /^#{6}\s+(.+)/,
    hr: /^-{3,}/,
    li: /^-\s+(.+)/,
    sub_li: /^\s{4}-\s+(.+)/,
    subsub_li: /^\s{8}-\s+(.+)/,
    code: /^`{3}(.*)/,
    b: /\*\*(.+?)\*\*/g,
    i: /\*(.+?)\*/g,
}

type RegExpType = keyof (typeof regExps);

const lineTypes = ["h1", "h2", "h3", "h4", "h5", "h6", "li", "hr", "code", "sub_li", "subsub_li"];

const lineDecoratorMap: Map<RegExpType, string> = new Map([
    ["hr", "<hr/>"],
]);

const contentModifierMap: Map<RegExpType, [string, string]> = new Map([
    ["b", ["<b>", "</b>"]],
    ["i", ["<i>", "</i>"]],
]);

const blockMap: Map<RegExpType, [string, string]> = new Map([
    ["code", ["<div style='background-color: black; color: white; margin-top: 0.2rem; margin-bottom: 0.5rem;'>", "</div>"]]
]);

const blockParseFuncMap: Map<RegExpType, (lineContent: string, blockPara: string | null) => string> = new Map([
    ["code", (lineContent, blockPara) => {
        lineContent = replaceSpace(lineContent);
        if (blockPara !== null) {
            blockPara = blockPara.toLowerCase();
            const transFunc = codeTransMap.get(blockPara);

            lineContent = transFunc !== undefined ? transFunc(lineContent) : lineContent;
        }
        lineContent += "<br/>";
        return lineContent;
    }]
]);

const codeTransMap: Map<string, (lineContent: string) => string> = new Map([
    ["javascript", lineContent => {
        lineContent = wrapKeyword(lineContent, new Map([
            ["const", wrapInDarkBlue],
            ["function", wrapInDarkBlue],
            ["export", wrapInPurple],
            ["import", wrapInPurple],
            ["return", wrapInPurple],
            ["for", wrapInPurple],
            ["if", wrapInPurple],
            ["default", wrapInPurple],
            ["continue", wrapInPurple],
            ["finally", wrapInPurple],
            ["try", wrapInPurple],
            ["catch", wrapInPurple],
            ["as", wrapInPurple],
            ["from", wrapInPurple],
            ["throw", wrapInPurple],
            ["case", wrapInPurple],
            ["true", wrapInDarkBlue],
            ["false", wrapInDarkBlue],
            ["class", wrapInDarkBlue],
            ["this", wrapInDarkBlue],
            ["final", wrapInDarkBlue],
            ["while", wrapInDarkBlue],
            ["in", wrapInDarkBlue],
            ["of", wrapInDarkBlue],
            ["null", wrapInDarkBlue],
            ["undefined", wrapInDarkBlue],
            ["typeof", wrapInDarkBlue],
            ["let", wrapInDarkBlue],
            ["var", wrapInDarkBlue],
            [KEYWORD_VARIABLE, wrapInLightBlue],
            [KEYWORD_FUNCTION, wrapInLightYellow],
            [KEYWORD_NUMBER, wrapInLightGreen],
            [KEYWORD_BRACKET, wrapInYellow],
            [KEYWORD_BRACE, wrapInYellow],
        ]));
        return lineContent;
    }]
])

const KEYWORD_VARIABLE = "===variable===";
const KEYWORD_FUNCTION = "===function===";
const KEYWORD_NUMBER = "===number===";
const KEYWORD_BRACKET = "===bracket===";
const KEYWORD_BRACE = "===brace===";

function wrapSubLi(lineContent: string) {
    return `<li style='margin-left: 1.5rem' type='circle'>${lineContent}</li>`;
}

function wrapSubSubLi(lineContent: string) {
    return `<li style='margin-left: 3rem' type='square'>${lineContent}</li>`;
}

function wrapKeyword(lineContent: string, keywordMap: Map<string, (word: string) => string>) {
    const words = lineContent.split("&nbsp");
    for (let i = 0; i < words.length; i++) {

        words[i] = words[i].replace(";", wrapInWhite(";"));

        const word = words[i];
        const keyWordWrap = keywordMap.get(word);
        if (keyWordWrap !== undefined) {
            words[i] = keyWordWrap(word);
            continue;
        }
        const functionWrap = keywordMap.get(KEYWORD_FUNCTION);
        const variableWrap = keywordMap.get(KEYWORD_VARIABLE);
        const numberWrap = keywordMap.get(KEYWORD_NUMBER);

        if (functionWrap !== undefined && /^([a-zA-Z]+)\(/.test(word)) {
            const funcName = (/^([a-zA-Z]+)\(/.exec(word) as string[])[1] as string;
            words[i] = words[i].replace(funcName, functionWrap(funcName));
            continue;
        }
        if (numberWrap !== undefined && /^([0-9]+)/.test(word)) {
            const num = (/^([0-9]+)/.exec(word) as string[])[1] as string;
            words[i] = words[i].replace(num, numberWrap(num));
            words[i] = numberWrap(word);
            continue
        }
        if (variableWrap !== undefined && /^[a-zA-Z]+[0-9]*$/.test(word)) {
            words[i] = variableWrap(word);
            continue;
        }
    }
    lineContent = words.join("&nbsp");

    const bracketWrap = keywordMap.get(KEYWORD_BRACKET);
    if (bracketWrap !== undefined) {
        lineContent = lineContent.replace(/(\W)(\()/g, "$1" + bracketWrap("("));
        lineContent = lineContent.replace(/(\))([^;"])/g, bracketWrap(")") + "$2");
    }

    const braceWrap = keywordMap.get(KEYWORD_BRACE);
    if (braceWrap !== undefined) {
        lineContent = lineContent.replace(/\{/g, braceWrap("{"));
        lineContent = lineContent.replace(/\}/g, braceWrap("}"));
    }

    return lineContent;
}

function wrapInSpan(word: string, color: string) {
    return `<span style="color: ${color};">${word}</span>`;
}

function wrapInDarkBlue(word: string) {
    return wrapInSpan(word, "rgb(86,156,214)");
}

function wrapInBlue(word: string) {
    return wrapInSpan(word, "rgb(79,193,255)");
}

function wrapInLightBlue(word: string) {
    return wrapInSpan(word, "rgb(156,220,254)");
}

function wrapInPurple(word: string) {
    return wrapInSpan(word, "rgb(197,134,192)");
}

function wrapInLightYellow(word: string) {
    return wrapInSpan(word, "rgb(240,240,185)");
}

function wrapInYellow(word: string) {
    return wrapInSpan(word, "rgb(255,229,0)");
}

function wrapInLightGreen(word: string) {
    return wrapInSpan(word, "rgb(181,206,168)");
}

function wrapInWhite(word: string) {
    return wrapInSpan(word, "white");
}

function replaceSpace(target: string) {
    return target.replace(/\s/g, "&nbsp");
}

function getBlockTag(lineType: RegExpType | null, index: 0 | 1) {
    if (lineType === null)
        return "";
    const item = blockMap.get(lineType);
    if (item === undefined)
        return "";
    return item[index];
}

function loadMathJax() {
    if (window === undefined || document === undefined)
        return;
    (window as any).MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        },
        loader: {load: ["input/tex", "output/chtml"]}
    };

    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    script.addEventListener("load",() => {
        console.log("math ready");
    })
    document.head.appendChild(script);
}

class MdParser {
    #raw: string
    #parsed: string | null
    #currentLine: string | null
    #block: RegExpType | null
    #blockPara: string | null
    #alreadyLineBroken: boolean
    constructor(text: string) {
        this.#raw = text;
        this.#parsed = null;
        this.#currentLine = null;
        this.#block = null;
        this.#blockPara = null;
        this.#alreadyLineBroken = false;
    }

    static initMaths() {
        loadMathJax();
    }

    getHtml() {
        if (this.#parsed === null) {
            this.#parsed = this.#parse();
        }
        return this.#parsed;
    }

    #parse() {
        this.#parsed = "";
        this.#nextLine();
        while (this.#currentLine !== null) {
            this.#parsed += this.#getParsedLine();
            this.#nextLine();
        }
        return this.#parsed;
    }

    #nextLine() {
        if (this.#raw === "") {
            this.#currentLine = null;
            return;
        }
        const lnPos = this.#raw.indexOf("\n");
        if (lnPos === -1) {
            this.#currentLine = this.#raw;
            this.#raw = "";
            return;
        }
        this.#currentLine = this.#raw.slice(0, lnPos);
        this.#raw = this.#raw.slice(lnPos + 1, this.#raw.length);
    }

    #getParsedLine() {
        const lineType = this.#getLineType();
        if (this.#block === null && this.#isBlockLine(lineType)) {
            this.#block = lineType;
            this.#setBlockParameter(lineType);
            return this.#getBlockStarter(lineType);
        }
        if (this.#block !== null) {
            if (this.#block === lineType) {
                this.#block = null;
                this.#blockPara = null;
                return this.#getBlockEnder(lineType);
            } else {
                return this.#parseLineInBlock(this.#getLineContent(lineType));
            }
        }

        if (this.#isDecoratorLine(lineType))
            return this.#getDecorator(lineType);

        return this.#wrapLineContent(this.#getLineContent(lineType), lineType);
    }

    #getLineType(): RegExpType | null {
        let lineType = null;
        if (this.#currentLine === null)
            return lineType;
        lineTypes.forEach(key => {
            if (regExps[key as RegExpType].test(this.#currentLine as string)) {
                lineType = key;
            }
        });
        return lineType;
    }

    #getLineContent(lineType: RegExpType | null) {
        if (this.#currentLine === null)
            return "";
        if (lineType === null)
            return this.#currentLine;
        return (regExps[lineType as RegExpType].exec(this.#currentLine) as RegExpExecArray)[1];
    }

    #wrapLineContent(lineContent: string, lineType: RegExpType | null) {
        lineContent = this.#addBrForEmptyLine(lineContent);
        lineContent = this.#addContentModifier(lineContent);
        if (lineType === null)
            return this.#addBrIfNecessary(lineContent);

        switch (lineType) {
            case "sub_li":
                return wrapSubLi(lineContent);
            case "subsub_li":
                return wrapSubSubLi(lineContent);
            default:
                return `<${lineType}>${lineContent}</${lineType}>`;
        }
    }

    #addBrIfNecessary(lineContent: string) {
        // 3 is unexpected but correct. The right count for a br is 2.
        if (/\s{3}$/.test(lineContent))
            return lineContent + "</br>";
        return lineContent;
    }

    #addBrForEmptyLine(lineContent: string) {
        if (this.#alreadyLineBroken && !this.#isEmptyLine(lineContent)) {
            this.#alreadyLineBroken = false;
        }
        if (!this.#alreadyLineBroken && this.#isEmptyLine(lineContent)) {
            this.#alreadyLineBroken = true;
            return "<br/>";
        }
        return lineContent;
    }

    #isEmptyLine(lineContent: string) {
        if (lineContent === "")
            return true;
        const spaceLineReg = /^\s+$/;
        return spaceLineReg.test(lineContent);
    }

    #addContentModifier(lineContent: string) {
        for (const modifier of contentModifierMap) {
            const modifierName = modifier[0];
            const modifierReg = regExps[modifierName];
            const modifierTags = modifier[1];
            lineContent = lineContent.replace(modifierReg, modifierTags[0] + "$1" + modifierTags[1]);
        }
        return lineContent;
    }

    #isDecoratorLine(lineType: RegExpType | null) {
        if (lineType === null)
            return false;
        return lineDecoratorMap.has(lineType);
    }

    #getDecorator(lineType: RegExpType | null) {
        if (lineType === null)
            return "DECORATOR_MISSING";
        return lineDecoratorMap.get(lineType);
    }

    #isBlockLine(lineType: RegExpType | null) {
        if (lineType === null)
            return false;
        return blockMap.get(lineType) !== undefined;
    }

    #setBlockParameter(lineType: RegExpType | null) {
        this.#blockPara = this.#getLineContent(lineType) || null;
    }

    #getBlockStarter(lineType: RegExpType | null) {
        return getBlockTag(lineType, 0);
    }

    #getBlockEnder(lineType: RegExpType | null) {
        return getBlockTag(lineType, 1);
    }

    #parseLineInBlock(lineContent: string) {
        if (this.#block === null)
            return "BLOCK_MISSING";
        const blockParseFunc = blockParseFuncMap.get(this.#block);
        if (blockParseFunc === undefined)
            return "BLOCK_PARSE_FUNC_MISSING";
        return blockParseFunc(lineContent, this.#blockPara);
    }
}

export default MdParser;