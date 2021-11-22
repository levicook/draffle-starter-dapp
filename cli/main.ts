import * as anchor from "@project-serum/anchor"
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { DEFAULT_RPC_HOST, DRAFFLE_PROGRAM_ID } from '../lib/constants'
import { program as cli } from 'commander'

interface Args {
    rpcHost: string,
    programId: string,
}

async function connect(args: Args) {
    const programId = new PublicKey(args.programId)

    const commitment = 'confirmed' // TODO from args?

    const connection = new Connection(args.rpcHost, commitment)

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
    const args = cli.opts<Args>()
    const { idl } = await connect(args)
    const json = JSON.stringify(idl, null, '\t')
    console.log(json)
}

async function createRaffle() {
    const args = cli.opts<Args>()
    console.log('create-raffle', args)
}

async function showRaffle() {
    const args = cli.opts<Args>()
    console.log('show-raffle', args)
}

async function addPrize() {
    const args = cli.opts<Args>()
    console.log('add-prize', args)
}

async function buyTickets() {
    const args = cli.opts<Args>()
    console.log('buy-tickets', args)
}

async function revealWinners() {
    const args = cli.opts<Args>()
    console.log('reveal-winners', args)
}

async function claimPrize() {
    const args = cli.opts<Args>()
    console.log('claim-prize', args)
}

async function collectProceeds() {
    const args = cli.opts<Args>()
    console.log('collect-proceeds', args)
}

cli
    .addHelpCommand()
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