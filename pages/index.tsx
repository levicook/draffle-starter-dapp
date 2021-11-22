import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import draffle from '../lib/draffle'
console.log(draffle)

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>dRaffle Starter dApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        ??
      </main>

      <footer className={styles.footer}>
        ??
      </footer>
    </div>
  )
}

export default Home