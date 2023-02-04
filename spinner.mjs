// Inspired by https://github.com/KyleMit/gpt-cli and https://github.com/sindresorhus/cli-spinners
import { stdout } from "node:process";

const Spinner = (type) => {
    const spinners = {
        dots: { interval: 80, frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] },
        quarters: { interval: 50, frames: ["◴", "◷", "◶", "◵"] },
        halves: { interval: 50, frames: ["◐","◓","◑","◒"] },
        clock: { interval: 100, frames: ["🕛 ","🕐 ","🕑 ","🕒 ","🕓 ","🕔 ","🕕 ","🕖 ","🕗 ","🕘 ","🕙 ","🕚 "] },
        horizontal: { interval: 100, frames: ["▰▱▱▱▱▱▱","▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰","▱▰▰▰▰▰▰","▱▱▰▰▰▰▰","▱▱▱▰▰▰▰","▱▱▱▱▰▰▰","▱▱▱▱▱▰▰","▱▱▱▱▱▱▰","▱▱▱▱▱▱▱","▰▱▱▱▱▱▱"] },
        line: { interval: 50, frames: [ "-", "\\", "|", "/" ] }
    }
    const cursorEsc = {
        hide: "\u001B[?25l",
        show: "\u001B[?25h",
    }
    stdout.write(cursorEsc.hide)

    let timer;

    const start = () => {
        let i = 0;
        timer = setInterval(() => {
            stdout.write("\r" + spinners[type].frames[i++]);
            i = i >= spinners[type].frames.length ? 0 : i;
        }, spinners[type].interval);
    }

    const stop = () => {
        clearInterval(timer);
        stdout.write("\r");
        stdout.write(cursorEsc.show);
    }

    return {
        start,
        stop
    }
}

export default Spinner;