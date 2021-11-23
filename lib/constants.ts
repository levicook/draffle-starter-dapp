
export const DEFAULT_RPC_HOST = (
    process.env.NEXT_PUBLIC_DEFAULT_RPC_HOST ||
    'https://api.mainnet-beta.solana.com'
)

export const DEFAULT_PROGRAM_ID = (
    process.env.NEXT_PUBLIC_DEFAULT_PROGRAM_ID ||
    'dRafA7ymQiLKjR5dmmdZC9RPX4EQUjqYFB3mWokRuDs'
)

export const RAFFLE_ACCOUNT_SIZE = 136      // 8 + size_of::<draffle::Raffle>()
export const ENTRANTS_ACCOUNT_SIZE = 160016 // 8 + size_of::<draffle::Entrants>()