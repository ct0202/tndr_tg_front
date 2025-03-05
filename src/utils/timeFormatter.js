//форматирование времени для последней активности юзера
export const getRelativeTime = (lastSeen) => {
    if (!lastSeen) return "Неизвестно";

    const diff = (new Date() - new Date(lastSeen)) / 1000;
    const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

    if (diff < 60) return "только что";
    if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
    if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
    if (diff < 604800) return rtf.format(-Math.floor(diff / 86400), "day");
    if (diff < 2419200) return rtf.format(-Math.floor(diff / 604800), "week");

    return new Date(lastSeen).toLocaleDateString("ru-RU");
};
