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
    ["code", ["<pre><code class='javascript'>", "</code></pre>"]]
]);

const blockParseFuncMap: Map<RegExpType, (lineContent: string, blockPara: string | null) => string> = new Map([
    ["code", (lineContent, _) => {
        return lineContent + "<br/>";
    }]
]);

function hasScript(src: string) {
    return document.querySelector(`script[src='${src}']`) !== null;
}

function hasCSS(href: string) {
    return document.querySelector(`link[href='${href}']`) !== null;
}

function loadScript(src: string, reloadEveryTime: boolean = true, async: boolean = false, callback: () => void = () => {}) {
    if(!reloadEveryTime && hasScript(src))
        return;
    console.log(`script loaded: ${src}`);
    let script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.addEventListener("load", callback);
    document.head.appendChild(script);
}

function loadCSS(href: string) {
    if(hasCSS(href))
        return;
    console.log(`css loaded: ${href}`);
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}


function wrapSubLi(lineContent: string) {
    return `<li style='margin-left: 1.5rem' type='circle'>${lineContent}</li>`;
}

function wrapSubSubLi(lineContent: string) {
    return `<li style='margin-left: 3rem' type='square'>${lineContent}</li>`;
}


function getBlockTag(lineType: RegExpType | null, index: 0 | 1) {
    if (lineType === null)
        return "";
    const item = blockMap.get(lineType);
    if (item === undefined)
        return "";
    return item[index];
}

function initCodeBlock(lang: string) {
    lang = lang.toLowerCase();
    if(lang === "javascript") {
        loadCSS("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/stackoverflow-dark.min.css");
        loadScript("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js", true, true, () => {(window as any).hljs.highlightAll();});
    }else{
        console.log("UNEXPECTED CODE TYPE");
    }
}

function configMathJax() {
    if (window === undefined || document === undefined)
        return;
    (window as any).MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        },
        loader: { load: ["input/tex", "output/chtml"] }
    };
}

function loadMathJax() {
    configMathJax();
    loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js', true, true);
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
            this.#initBlock(lineType);
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

    #initBlock(lineType: RegExpType | null) {
        switch(lineType) {
            case "code":
                switch(this.#blockPara) {
                    case "javascript":
                        initCodeBlock("javascript");
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return;
    }
}

export default MdParser;