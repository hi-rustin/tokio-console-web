// The Duration class represents a duration of time.
export class Duration {
    // The number of seconds in the duration.
    seconds: bigint;
    // The number of nanoseconds in the duration.
    nanos: number;

    // The constructor takes the number of seconds and nanoseconds.
    constructor(seconds: bigint, nanos: number) {
        this.seconds = seconds;
        this.nanos = nanos;
        // Normalize the duration so that nanos is less than 1e9 and non-negative.
        this.normalize();
    }

    // Normalize ensures that nanos is less than 1e9 and non-negative.
    normalize(): Duration {
        let adjustment = 0;
        // If nanos is 1e9 or more, we need to adjust seconds and nanos.
        if (this.nanos >= 1e9) {
            adjustment = Math.floor(this.nanos / 1e9);
            this.seconds += BigInt(adjustment);
            this.nanos -= adjustment * 1e9;
        } else if (this.nanos < 0) {
            // If nanos is negative, we need to adjust seconds and nanos.
            adjustment = Math.floor(-this.nanos / 1e9) + 1;
            this.seconds -= BigInt(adjustment);
            this.nanos += adjustment * 1e9;
        }
        return this;
    }

    asDays(): number {
        return Number(this.seconds) / 86400;
    }

    asHours(): number {
        return Number(this.seconds) / 3600;
    }

    asMinutes(): number {
        return Number(this.seconds) / 60;
    }

    asSeconds(): number {
        return Number(this.seconds) + this.nanos / 1e9;
    }

    asMilliseconds(): number {
        return Number(this.seconds) * 1000 + this.nanos / 1e6;
    }

    asMicroseconds(): number {
        return Number(this.seconds) * 1e6 + this.nanos / 1000;
    }

    // subtract returns a new Duration that represents the difference between this duration and another.
    subtract(other: Duration): Duration {
        const seconds = this.seconds - other.seconds;
        const nanos = this.nanos - other.nanos;
        const result = new Duration(seconds, nanos);
        return result.normalize();
    }

    // add returns a new Duration that represents the sum of this duration and another.
    add(other: Duration): Duration {
        const result = new Duration(
            this.seconds + other.seconds,
            this.nanos + other.nanos,
        );
        return result.normalize();
    }

    // greaterThan checks if this duration is greater than another.
    greaterThan(other: Duration): boolean {
        return (
            this.seconds > other.seconds ||
            (this.seconds === other.seconds && this.nanos > other.nanos)
        );
    }

    // greaterThanOrEqual checks if this duration is greater than or equal to another.
    greaterThanOrEqual(other: Duration): boolean {
        return !this.lessThan(other);
    }

    // equals checks if this duration is equal to another.
    equals(other: Duration): boolean {
        return this.seconds === other.seconds && this.nanos === other.nanos;
    }

    // lessThan checks if this duration is less than another.
    lessThan(other: Duration): boolean {
        return (
            this.seconds < other.seconds ||
            (this.seconds === other.seconds && this.nanos < other.nanos)
        );
    }

    toString(precision: number = 2): string {
        const totalSeconds = this.asSeconds();
        const units = [
            { value: this.asDays(), unit: "d" },
            { value: this.asHours() % 24, unit: "h" },
            { value: this.asMinutes() % 60, unit: "m" },
            { value: totalSeconds % 60, unit: "s" },
            { value: this.asMilliseconds() % 1000, unit: "ms" },
            { value: this.asMicroseconds() % 1000, unit: "µs" },
            { value: this.nanos, unit: "ns" },
        ];

        let str = "";
        let partsIncluded = 0;

        if (totalSeconds >= 60) {
            // For durations longer than 60 seconds, include up to two non-zero units
            for (const { value, unit } of units) {
                const flooredValue = Math.floor(value);
                if (flooredValue > 0) {
                    str += `${flooredValue}${unit} `;
                    partsIncluded++;
                    if (partsIncluded === 2) break;
                }
            }
        } else {
            // For durations shorter than 60 seconds, display the most significant non-zero unit
            for (const { value, unit } of units) {
                if (Math.floor(value) > 0) {
                    str = `${value.toFixed(precision)}${unit}`;
                    break;
                }
            }
        }

        return str || `${this.nanos}ns`;
    }

    // valueOf returns the duration as a number of microseconds.
    // Used for sorting.
    valueOf(): number {
        return this.asMicroseconds();
    }

    // fromNano returns a new Duration representing the given number of nanoseconds.
    static fromNano(nanos: bigint): Duration {
        const seconds = nanos / BigInt(1e9);
        const remainderNanos = nanos % BigInt(1e9);
        // After normalization, we can safely cast to number.
        return new Duration(seconds, Number(remainderNanos));
    }

    // now returns a new Duration representing the current time.
    static now(): Duration {
        const now = new Date();
        return Duration.fromDate(now);
    }

    // fromDate returns a new Duration representing the time since the given date.
    static fromDate(date: Date): Duration {
        const ms = date.getTime();
        const seconds = BigInt(Math.floor(ms / 1000));
        const nanos = (ms % 1000) * 1e6;
        return new Duration(seconds, nanos);
    }
}

// The Duration class can also be used as a timestamp.
export { Duration as Timestamp };
