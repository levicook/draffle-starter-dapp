import * as draffle from "../lib/draffle"
import { Commitment, Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { DEFAULT_RPC_HOST, DEFAULT_PROGRAM_ID, ENTRANTS_ACCOUNT_SIZE } from '../lib/constants'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { program as cli } from 'commander'

interface Args {
    commitment: Commitment,
    rpcHost: string,
    programId: string,
}

async function connect() {
    const args = cli.opts<Args>()
    const payer = Keypair.generate() // TODO make this an arg

    return draffle.connect({
        payer,
        ...args
    })
}

async function showIDL() {
    const { idl } = await connect()
    console.log(JSON.stringify(idl, null, '  '))
    process.exit(0)
}

async function createRaffle() {
    const { connection, payer, program, programId } = await connect()

    const entrants = Keypair.generate()

    const raffle = await draffle.findRaffle(entrants.publicKey, programId)

    const proceeds = await draffle.findProceeds(raffle, programId)

    // TODO: this rent could be smarter, based on maxEntrants, right?
    const entrantsRent = await connection.getMinimumBalanceForRentExemption(ENTRANTS_ACCOUNT_SIZE);

    await program.rpc.createRaffle({
        accounts: {
            raffle,
            entrants: entrants.publicKey,
            creator: payer.publicKey,
            // proceeds: TODO,
            // proceedsMint: TODO,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [
            payer
        ],
        instructions: [
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: raffle,
                lamports: entrantsRent,
                programId: program.programId,
                space: ENTRANTS_ACCOUNT_SIZE,
            }),
        ]
    });


    process.exit(0)
}

async function showRaffle() {
    console.log('show-raffle')
    process.exit(0)
}

async function addPrize() {
    console.log('add-prize')
    process.exit(0)
}

async function buyTickets() {
    console.log('buy-tickets')
}

async function revealWinners() {
    console.log('reveal-winners')
}

async function claimPrize() {
    console.log('claim-prize')
}

async function collectProceeds() {
    console.log('collect-proceeds')
}

cli
    .addHelpCommand()
    .requiredOption('-c, --commitment [string]', 'commitment', 'recent')
    .requiredOption('-r, --rpc-host [string]', 'rpc host', DEFAULT_RPC_HOST)
    .requiredOption('-p, --program-id [string]', 'draffle program id', DEFAULT_PROGRAM_ID)

cli
    .command('show-idl')
    .description('show IDL')
    .action(showIDL)

cli
    .command('create-raffle')
    .description('create raffle')
    .action(createRaffle)

cli
    .command('show-raffle')
    .description('show raffle')
    .action(showRaffle)

cli
    .command('add-prize')
    .description('add a prize')
    .action(addPrize);

cli
    .command('buy-tickets')
    .description('buy tickets')
    .action(buyTickets);

cli
    .command('reveal-winners')
    .description('reveal winners')
    .action(revealWinners);

cli
    .command('claim-prize')
    .description('claim prize')
    .action(claimPrize);

cli
    .command('collect-proceeds')
    .description('collect proceeds')
    .action(collectProceeds);

(async () => {
    await cli.parseAsync(process.argv)
})();