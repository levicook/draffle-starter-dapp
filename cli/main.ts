import * as anchor from "@project-serum/anchor"
import { Commitment, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { DEFAULT_RPC_HOST, DRAFFLE_PROGRAM_ID } from '../lib/constants'
import { program as cli } from 'commander'

interface Args {
    commitment: Commitment,
    rpcHost: string,
    programId: string,
}

async function connect() {
    const args = cli.opts<Args>()

    const programId = new PublicKey(args.programId)
    const connection = new Connection(args.rpcHost, args.commitment)

    const wallet = new anchor.Wallet(Keypair.generate()) // TODO from args?

    const provider = new anchor.Provider(connection, wallet, {
        skipPreflight: true
    })

    const idl = await anchor.Program.fetchIdl(programId, provider)

    const program = new anchor.Program(idl!, programId, provider)

    return {
        idl,
        program,
        programId,
    }
}

async function showIDL() {
    const { idl } = await connect()
    console.log(JSON.stringify(idl, null, '  '))
    process.exit(0)
}

async function createRaffle() {
    console.log('create-raffle')
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
    .requiredOption('-c, --commitment [string]', 'commitment', 'confirmed')
    .requiredOption('-r, --rpc-host [string]', 'rpc host', DEFAULT_RPC_HOST)
    .requiredOption('-p, --program-id [string]', 'draffle program id', DRAFFLE_PROGRAM_ID)

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

(async () => { await cli.parseAsync(process.argv) })();