import * as anchor from "@project-serum/anchor"
import { MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { ENTRANTS_ACCOUNT_SIZE } from "./constants"
// import * as constants from './constants'

interface ConnectArgs {
    commitment: Commitment,
    payer: Keypair,
    programId: string,
    rpcHost: string,
}

export async function connect(args: ConnectArgs) {
    const payer = args.payer

    const connection = new Connection(args.rpcHost, 'finalized')
    console.error('RPC Host', args.rpcHost)

    // TODO remove this or make it an explicit command line arg
    if (await connection.getBalance(payer.publicKey) === 0) {
        const airdropAmt = 5 * LAMPORTS_PER_SOL
        const airdropReq = await connection.requestAirdrop(payer.publicKey, airdropAmt)
        console.error('Airdrop request', airdropAmt, 'sig', airdropReq)
        console.error('Airdrop results', await connection.confirmTransaction(airdropReq))
    }
    console.error('Payer address', payer.publicKey.toBase58())
    console.error('Payer balance', await connection.getBalance(payer.publicKey))

    const provider = new anchor.Provider(connection, new anchor.Wallet(args.payer), {
        skipPreflight: true
    })

    const programId = new PublicKey(args.programId)
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

export async function initEntrants(
    connection: Connection,
    entrants: Keypair,
    payer: Keypair,
    programId: PublicKey,
): Promise<TransactionInstruction[]> {
    // TODO: this rent should be based on maxEntrants (maybe?)
    const rent = await connection.getMinimumBalanceForRentExemption(ENTRANTS_ACCOUNT_SIZE);

    return [
        SystemProgram.createAccount({
            newAccountPubkey: entrants.publicKey,
            fromPubkey: payer.publicKey,
            lamports: rent,
            programId: programId,
            space: ENTRANTS_ACCOUNT_SIZE,
        }),
    ]
}

export async function initMint(
    connection: Connection,
    creator: Keypair,
    mint: Keypair,
    decimals = 0,
): Promise<TransactionInstruction[]> {
    const rent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
    );

    return [
        SystemProgram.createAccount({
            newAccountPubkey: mint.publicKey,
            fromPubkey: creator.publicKey,
            lamports: rent,
            programId: TOKEN_PROGRAM_ID,
            space: MintLayout.span,
        }),
        Token.createInitMintInstruction(
            TOKEN_PROGRAM_ID,
            mint.publicKey,
            decimals,
            creator.publicKey, // mintAuthority
            null               // freezeAuthority
        ),
    ]
}