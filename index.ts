enum Direction {
    North = 'N',
    East = 'E',
    South = 'S',
    West = 'W'
}

enum Instruction {
    Left = 'L',
    Right = 'R',
    Move = 'M'
}

interface IInitialCoordinates {
    x: number
    y: number
    direction: Direction
}

interface IPlateau {
    x: number
    y: number
}

interface IRover {
    initialCoordinates: IInitialCoordinates
    instructions: string
}

const isValidInstruction = (instruction: string): instruction is Instruction => {
    const validInstructions = Object.values(Instruction)
    return validInstructions.includes(instruction as Instruction)
}

const isWithinPlateau = (x: number, y: number, plateau: IPlateau): boolean => {
    return x >= 0 && x <= plateau.x && y >= 0 && y <= plateau.y
}

const handleDirectionChange = (direction: Direction, instruction: Instruction.Left | Instruction.Right): Direction => {
    const directions: Direction[] = [Direction.North, Direction.East, Direction.South, Direction.West]
    let currentIndex = directions.indexOf(direction)

    if (instruction === Instruction.Left) {
        currentIndex = (currentIndex - 1 + directions.length) % directions.length
    } else if (instruction === Instruction.Right) {
        currentIndex = (currentIndex + 1) % directions.length
    }
    return directions[currentIndex]
}

const moveRover = (x: number, y: number, direction: Direction, plateau: IPlateau): { x: number, y: number } => {
    switch (direction) {
        case Direction.North:
            y = Math.min(y + 1, plateau.y)
            break
        case Direction.East:
            x = Math.min(x + 1, plateau.x)
            break
        case Direction.South:
            y = Math.max(y - 1, 0)
            break
        case Direction.West:
            x = Math.max(x - 1, 0)
            break
    }

    return {x, y}
}

const startRover = (initialCoordinates: IInitialCoordinates, instructions: string, plateau: IPlateau): IInitialCoordinates | null => {
    let {x, y, direction} = initialCoordinates

    if (!isWithinPlateau(x, y, plateau)) {
        console.error('Error: Initial coordinates are outside of the plateau bounds.')
        return null
    }

    const instructionsArray = instructions.split('')

    for (const instruction of instructionsArray) {
        if (!isValidInstruction(instruction)) {
            console.error(`Error: Invalid instruction '${instruction}' found.`)
            return null
        }

        if (instruction === Instruction.Left || instruction === Instruction.Right) {
            direction = handleDirectionChange(direction, instruction as Instruction.Left | Instruction.Right)
        } else if (instruction === Instruction.Move) {
            const newPosition = moveRover(x, y, direction, plateau)
            x = newPosition.x
            y = newPosition.y

            if (!isWithinPlateau(x, y, plateau)) {
                console.error('Error: Rover moved outside the plateau bounds.')
                return null
            }
        }
    }

    return {x, y, direction}
}

const runRovers = (rovers: IRover[], plateau: IPlateau): void => {
    rovers.forEach((rover, index) => {
        console.log(`Starting Rover ${index + 1}...`)
        const finalCoordinates = startRover(rover.initialCoordinates, rover.instructions, plateau)

        if (finalCoordinates) {
            console.log(`Rover ${index + 1} final position: ${finalCoordinates.x} ${finalCoordinates.y} ${finalCoordinates.direction}`)
        } else {
            console.error(`Rover ${index + 1} encountered an error and could not complete its instructions.`)
        }
    })
}

const rovers: IRover[] = [
    {
        initialCoordinates: {x: 1, y: 2, direction: Direction.North},
        instructions: 'LMLMLMLMM'
    },
    {
        initialCoordinates: {x: 3, y: 3, direction: Direction.West},
        instructions: 'MMRMMRMRRM'
    },
    {
        initialCoordinates: {x: 4, y: 6, direction: Direction.South},
        instructions: 'LLMMMRRLV'
    }
]

const plateau = {x: 10, y: 15}

runRovers(rovers, plateau)
