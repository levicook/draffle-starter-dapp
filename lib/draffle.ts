import * as anchor from "@project-serum/anchor"
import { Commitment, Connection, Keypair, PublicKey } from '@solana/web3.js'
import * as constants from './constants'

interface ConnectArgs {
    commitment: Commitment,
    payer: Keypair,
    programId: string,
    rpcHost: string,
}

export async function connect(args: ConnectArgs) {
    const payer = args.payer

    const programId = new PublicKey(args.programId)
    const connection = new Connection(args.rpcHost, args.commitment)
    const wallet = new anchor.Wallet(args.payer)
    const provider = new anchor.Provider(connection, wallet, {
        skipPreflight: true
    })

    const idl = await anchor.Program.fetchIdl(programId, provider)
    if (!idl) {
        throw new Error(`could not load idl for programId: ${args.programId}`)
    }

    const program = new anchor.Program(idl, programId, provider)

    return {
        connection,
        idl,
        payer,
        program,
        programId,
        provider,
    }
}

export async function findProceeds(
    raffle: PublicKey,
    programId: PublicKey,
): Promise<PublicKey> {
    const [proceeds,] = await PublicKey.findProgramAddress(
        [
            raffle.toBuffer(),
            Buffer.from("proceeds")
        ],
        programId,
    )
    return proceeds
}

export async function findRaffle(
    entrants: PublicKey,
    programId: PublicKey,
): Promise<PublicKey> {
    const [raffle,] = await PublicKey.findProgramAddress(
        [
            Buffer.from("raffle"),
            entrants.toBuffer()
        ],
        programId,
    )

    return raffle
}