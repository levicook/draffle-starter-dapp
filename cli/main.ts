import * as anchor from "@project-serum/anchor"
import * as draffle from "../lib/draffle"
import { Commitment, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js'
import { DEFAULT_RPC_HOST, DEFAULT_PROGRAM_ID, ENTRANTS_ACCOUNT_SIZE } from '../lib/constants'
import { program as cli } from 'commander'
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

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

    const entrants = Keypair.generate() // TODO accept from args
    console.log('Entrants address', entrants.publicKey.toBase58())

    const raffle = await draffle.findRaffle(entrants.publicKey, programId)
    console.log('Raffle address', raffle.toBase58())

    const proceeds = await draffle.findProceeds(raffle, programId)
    console.log('proceeds address', proceeds.toBase58())

    const proceedsMint = Keypair.generate()
    console.log('proceedsMint address', proceedsMint.publicKey.toBase58())

    const instructions = [
        ...await draffle.initEntrants(connection, entrants, payer, programId),
        ...await draffle.initMint(connection, payer, proceedsMint),
    ];

    const tx = new Transaction()
    instructions.forEach(ix => tx.add(ix))

    const sig1 = await connection.sendTransaction(tx, [
        payer,
        entrants,
        proceedsMint,
    ])
    console.error('sig1', await connection.confirmTransaction(sig1))

    const endTimestamp = new anchor.BN(1638071889051)
    const ticketPrice = new anchor.BN(1234)
    const maxEntrants = new anchor.BN(5000)

    const sig2 = await program.rpc.createRaffle(
        endTimestamp,
        ticketPrice,
        maxEntrants,
        {
            accounts: {
                raffle,
                entrants: entrants.publicKey,
                creator: payer.publicKey,
                proceeds,
                proceedsMint: proceedsMint.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            },
            signers: [
                payer
            ],
        }
    )
    console.error('sig2', await connection.confirmTransaction(sig2))

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