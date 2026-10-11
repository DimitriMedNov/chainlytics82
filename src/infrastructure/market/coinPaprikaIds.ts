/**
 * Traducción de identificadores entre CoinPaprika ("btc-bitcoin") y CoinGecko
 * ("bitcoin"). La app solo conoce los de CoinGecko.
 *
 * Regla general: el id de CoinPaprika es `<símbolo>-<nombre>` y el de
 * CoinGecko suele ser ese `<nombre>`. Las monedas en las que no se cumple van
 * en la tabla, sacada de cruzar el top 250 de los dos proveedores (oct 2026).
 * Fuera de esa tabla la regla es una aproximación.
 */
const GECKO_BY_PAPRIKA: Readonly<Record<string, string>> = {
  "bnb-binance-coin": "binancecoin",
  "xrp-xrp": "ripple",
  "steth-lido-staked-ether": "staked-ether",
  "wsteth-wrapped-liquid-staked-ether-20": "wrapped-steth",
  "matic-polygon": "matic-network",
  "rain-rain-protocol": "rain",
  "near-near-protocol": "near",
  "avax-avalanche": "avalanche-2",
  "usd1-usd1": "usd1-wlfi",
  "toncoin-the-open-network": "the-open-network",
  "qnt-quant": "quant-network",
  "cro-cryptocom-chain": "crypto-com-chain",
  "aave-new": "aave",
  "pump-pumpfun": "pump-fun",
  "ondo-ondo": "ondo-finance",
  "wld-worldcoin": "worldcoin-wld",
  "aster-aster": "aster-2",
  "wlfi-official-world-liberty-financial": "world-liberty-financial",
  "jup-jupiter-exchange-token": "jupiter-exchange-solana",
  "kcs-kucoin-token": "kucoin-shares",
  "rndr-render-token": "render-token",
  "pi2-pi-network": "pi-network",
  "night-midnight2": "midnight-3",
  "cake-pancakeswap": "pancakeswap-token",
  "stx-stacks": "blockstack",
  "stable-stable": "stable-2",
  "xdc-xdc-network": "xdce-crowd-sale",
  "ethfi-etherfi": "ether-fi",
  "flr-flare-network": "flare-networks",
  "bianrensheng-bianrensheng": "bianrensheng",
  "drv7-derive": "derive",
  "euroc-euro-coin": "euro-coin",
  "tusd-trueusd": "true-usd",
  "sei-sei": "sei-network",
  "bsv-bitcoin-sv": "bitcoin-cash-sv",
  "ff-falcon-finance": "falcon-finance-ff",
  "bttc-bittorrent-chain": "bittorrent",
  "sun-sun": "sun-token",
  "cfx-conflux-network": "conflux-token",
  "kite-kite-ai": "kite-2",
  "jto-jito": "jito-governance-token",
  "luna-terra": "terra-luna",
  "syrup-syrup-token": "syrup",
  "floki-floki-inu": "floki",
  "comp-compoundd": "compound-governance-token",
  "shfl-shuffle": "shuffle-2",
  "miota-iota": "iota",
  "crvusd-curvefi-usd-stablecoin": "crvusd",
  "eurcv-eur-coinvertible": "societe-generale-forge-eurcv",
  "useless-useless-coin": "useless-3",
  "xcn-chain": "chain-2",
  "s-sonic": "sonic-3",
  "inst-instadapp": "instadapp",
  "chsb-swissborg": "swissborg",
  "vsn-vision": "vision-3",
  "br-bedrock-dao": "bedrock-token",
  "gmt-gomining-token": "gmt-token",
  "b-buildon": "build-on",
  "gusd-gemini-dollar": "gusd",
  "sfp-safepal-token": "safepal",
  "cap-cap-2": "cap-4",
  "snx-synthetix-network-token": "havven",
  "chip-usdai": "chip-2",
  "beam-beam-eth": "beam-2",
  "geod-geodnet-token": "geodnet",
  "ultima-ultimaecosystem": "ultima",
  "ath14-aethir": "aethir",
  "awe-awe-network": "stp-network",
  "cash-cash": "cash-4",
};

const PAPRIKA_BY_GECKO: ReadonlyMap<string, string> = new Map(
  Object.entries(GECKO_BY_PAPRIKA).map(([paprikaId, geckoId]) => [geckoId, paprikaId]),
);

/** Id de CoinGecko para una moneda de CoinPaprika. */
export function toGeckoId(paprikaId: string, symbol: string): string {
  const known = GECKO_BY_PAPRIKA[paprikaId];
  if (known) return known;
  const prefix = `${symbol.toLowerCase()}-`;
  return paprikaId.startsWith(prefix) ? paprikaId.slice(prefix.length) : paprikaId;
}

/** Id de CoinPaprika cuando la moneda está en la tabla de excepciones. */
export function knownPaprikaId(geckoId: string): string | undefined {
  return PAPRIKA_BY_GECKO.get(geckoId);
}
