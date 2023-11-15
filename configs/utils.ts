export function shadeColor(color: string, percent: number) {
    if (!color) {
        return;
    }

    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    // @ts-ignore
    R = parseInt((R * (100 + percent)) / 100);
    // @ts-ignore
    G = parseInt((G * (100 + percent)) / 100);
    // @ts-ignore
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return `#${RR}${GG}${BB}`;
}

export const removeDuplicate = (array: any) => {
    let dups: any[] = [];
    return array.filter((el: any) => {
        if (dups.indexOf(el.id) == -1) {
            dups.push(el.id);
            return true;
        }

        return false;
    });
};

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getGreetings() {
    let hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs >= 12 && hrs <= 17) return "Good Afternoon";
    if (hrs >= 17 && hrs <= 24) return "Good Evening";
}
