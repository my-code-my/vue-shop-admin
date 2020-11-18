export function formatTime (originVal) {
    const dt = new Date(originVal)

    const y = (dt.getFullYear() + '').padStart(2, '0')
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDay() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}