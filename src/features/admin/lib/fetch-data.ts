import { fmpNewClient } from '@/lib/axios';
import { getEarnings } from '@/lib/fmp/info/get-earnings';
import { logger } from '@/lib/logger';
import { isStockValid } from '@/lib/utils/stock-helper';
import { chunkArray, parseData } from '../lib/parse-data';
import { Profile, RatiosTTM, StockDCF, StockPeer } from '../types/upload';

export const fetchData = async ({ startTime }: { startTime: number }) => {
  const [
    profile0,
    profile1,
    profile2,
    profile3,
    peerResp,
    dcfResp,
    ratiosResp,
    earnings,
  ] = await Promise.all([
    fmpNewClient.get<string>('profile-bulk?part=0'),
    fmpNewClient.get<string>('profile-bulk?part=1'),
    fmpNewClient.get<string>('profile-bulk?part=2'),
    fmpNewClient.get<string>('profile-bulk?part=3'),
    fmpNewClient.get<string>('peers-bulk'),
    fmpNewClient.get<string>('dcf-bulk'),
    fmpNewClient.get<string>('ratios-ttm-bulk'),
    getEarnings(),
  ]);

  const profiles0 = parseData<Profile>(profile0.data);
  const profiles1 = parseData<Profile>(profile1.data);
  const profiles2 = parseData<Profile>(profile2.data);
  const profiles3 = parseData<Profile>(profile3.data);
  const profiles = [...profiles0, ...profiles1, ...profiles2, ...profiles3];
  const parsedPeers = parseData<StockPeer>(peerResp.data);
  const parsedDCF = parseData<StockDCF>(dcfResp.data);
  const rawRatiosTTM = parseData<RatiosTTM>(ratiosResp.data);

  logger.info(
    'uploadStocks (fetched): time=%ss, tx=[profiles=%s, peers=%s, dcfs=%s, ratios=%s, earnings=%s]',
    ((Date.now() - startTime) / 1000).toFixed(1),
    !!profiles,
    !!parsedPeers,
    !!parsedDCF,
    !!rawRatiosTTM,
    !!earnings,
  );

  const ratioMap = new Map<string, RatiosTTM>();
  for (const chunk of chunkArray(rawRatiosTTM, 5000)) {
    for (const ratioItem of chunk) {
      ratioMap.set(String(ratioItem.symbol).toUpperCase(), ratioItem);
    }
  }

  const validProfiles = profiles.filter((p) => isStockValid(p));
  return validProfiles.map(({ symbol, ...profile }) => ({
    dcf: parsedDCF.find(
      (d) => String(d.symbol).toUpperCase() === String(symbol).toUpperCase(),
    ),
    earnings:
      earnings?.filter(
        (e) => String(e.symbol).toUpperCase() === String(symbol).toUpperCase(),
      ) ?? [],
    earningsDate: earnings?.find(
      (e) => String(e.symbol).toUpperCase() === String(symbol).toUpperCase(),
    )?.date,
    peersList: parsedPeers.find(
      (p) => String(p.symbol).toUpperCase() === String(symbol).toUpperCase(),
    )?.peers,
    profile: {
      ...profile,
      symbol: String(symbol).toUpperCase(),
    },
    ratiosTTM: profile.isEtf
      ? undefined
      : ratioMap.get(String(symbol).toUpperCase()),
  }));
};
