export function pascalToTitle(str: string | null | undefined) {
    if (!str) {
        return "";
    }

    if (str === str.toLowerCase()) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return str.replace(/([A-Z][a-z]*)/g, " $1").trim();
}
