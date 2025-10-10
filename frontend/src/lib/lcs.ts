// LCS function to find the longest common subsequence
export const lcs = (originalWords: string[], spokenWords: string[]) => {
    const lcsMatrix: number[][] = Array(originalWords.length + 1)
        .fill([])
        .map(() => Array(spokenWords.length + 1).fill(0))

    for (let i = 1; i <= originalWords.length; i++) {
        for (let j = 1; j <= spokenWords.length; j++) {
            if (originalWords[i - 1].toLowerCase() === spokenWords[j - 1].toLowerCase()) {
                lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1
            } else {
                lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1])
            }
        }
    }

    const result: number[] = []
    let i = originalWords.length
    let j = spokenWords.length

    while (i > 0 && j > 0) {
        if (originalWords[i - 1].toLowerCase() === spokenWords[j - 1].toLowerCase()) {
            result.unshift(i - 1)
            i--
            j--
        } else if (lcsMatrix[i - 1][j] > lcsMatrix[i][j - 1]) {
            i--
        } else {
            j--
        }
    }
    return result
}
