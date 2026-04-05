import { Plant, DeadPlant } from './types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Fiddle Leaf Fig',
    species: 'Fiddle Leaf Fig',
    scientificName: 'Ficus Lyrata',
    location: 'East Window',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvm-_DD3kAnRrQjN958Gdc7gSNdWmI9_KyYzNlAToFwJOeus7BGXDwZM33HyF-5chNK3nUogMXFxmd3HPD7p6Gr8dyVlA0ij_XrW_GbO1pSyukO-HL6U9ZL0_-j_UpAneNusGkzhRmZpw9TX2bYHna9tvH14CqKNHOqHLRRvj1JD8obT3tl6BZx30vP2Nktg0ahc1AE9Fww649mcxPXLP8IhMnqjzZDk5eRTxeron1sEzFLepUJG0hSETV-Bv5eoN9wRANWZqgyvw',
    waterStreak: 9,
    light: 'Bright Indirect',
    description: 'The crown jewel of your collection. Thriving in the indirect morning sun of the east window.',
    family: 'Moraceae',
    humidity: '60%+',
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    lastWatered: '2026-04-01T10:00:00Z',
    lastFertilized: '2026-03-15T10:00:00Z',
    history: [
      {
        date: 'October 24, 2023',
        event: 'Watered & Misted',
        description: 'Standard watering event. Soil was properly dried out.'
      },
      {
        date: 'October 15, 2023',
        event: 'New Leaf Unfurl',
        description: 'Spotted a new growth spike near the central node.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcH_srIGBCkrcEsRIaFydxcbURkw6Z0wdeMhfHSrXiFVDMw6VWIHZ0sSyiqfl7pz4m-6ideHhWUEwdSB5QxLxtpxDJzi1fgn12NSOi3kB11Xrarc_ZjYuUUdafnOb-j_G0byxLPEdYJ4JWF9VbVbsv_TXHER1pf1H4FFmtgTUd61z3C3pxxQ9Teqx7tSExy4mRMYQ5XNMKuCzpZup-K6QI1T9FIIrIbwdlALlpyqjz2m1BBEIMCCc42F4UUv8S_z0hpBAhn59JpK8'
      },
      {
        date: 'October 06, 2023',
        event: 'Fertilized',
        description: 'Applied 10-10-10 liquid fertilizer during watering.'
      }
    ]
  },
  {
    id: '2',
    name: 'Monstera',
    species: 'Monstera Deliciosa',
    scientificName: 'Monstera Deliciosa',
    location: 'North-facing Studio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB61VXi6vpxsY5lLFGLIfjIebWfXOGYAUnysF407EjCXF2v-YdCwJGxnRbt5drem2DdTN0YbJl5H0ttdjkomDtXSzz-5y9O2M-j3BVmiGW81HlTEEPSYrHyNH8xgWvwumPYEWOSvM19CJLyiqiwxQMIidAiECcEpPY3H1DbgIvI3awP-QSCPuptzpPUt0VuQiiOAh0aq2gXM5yreIR64uvtKKfgFzrOJ9To-o3fREhGiDuwtw7sxe4BTXZjJyAyA9DlmtIEgRTOgkY',
    needsWater: true,
    wateringFrequency: 5,
    lastWatered: '2026-03-30T10:00:00Z',
    light: 'Indirect',
    humidity: '65%+',
    family: 'Araceae Family',
    description: "Known as the Swiss Cheese Plant, this tropical beauty thrives in dappled light and high humidity. It's a statement of architectural elegance that breathes life into any interior sanctuary."
  },
  {
    id: '3',
    name: 'Snake Plant',
    species: 'Snake Plant',
    location: 'Bedroom Corner',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-2vBn2eZ3msQCL_YWw2vU4d7D7uzB2bTVANh6_9zNsn26xkk5gCetawvzz1DwBKytyGCGQE5iG362bAKlV-Ec2bYh38shSZOu4X4a4HP7y3FC_gJVLTrEKyYKxy9bi_QEicL5nXJL2lxneXG3K5mtxRBfeceZ5sQuABOxa6UhD_thp9NAOC7wukI8OD21LDZPxWzKFmrWnksw8SJPGERsVk-taT3NT99buf0-AczfY-7MsoefecMepT--gXH4XrV5N2x1ALkxdI',
    status: 'Vitals Stable',
    wateringFrequency: 14,
    lastWatered: '2026-03-20T10:00:00Z',
    waterStreak: 14
  },
  {
    id: '4',
    name: 'Golden Pothos',
    species: 'Golden Pothos',
    location: 'Kitchen Shelf',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxiqdt0Lv-803Lo_n-RaoQrXzlUI6EfTSUY__bTt9pTNqMkRNVplLDVwNhlm0_SZpsX52kSsy_zQ8NKZeEnP3zAGxLweRxWl89Y9kHndf04d2-GGe31lYiViEjjyTKkYP3ELrDBvKcKi34mWkl4-1unz-tIrAo4fpUCy-1YFbsxxhCXrT_ooHALfQ5zXpg8dvGVNAzcGdHeQtWL9D_ly_lIbaJg4PmidPQrEJLCwexl15jtoWk_n_gPcFQV7NbGi_ISW2izV7F9Zk',
    status: 'New Growth',
    wateringFrequency: 7,
    lastWatered: '2026-04-02T10:00:00Z',
    waterStreak: 5
  }
];

export const DEAD_PLANTS: DeadPlant[] = [
  {
    id: 'd1',
    name: 'Barnaby the Fiddle',
    species: 'Fiddle Leaf Fig',
    period: '2023 — 2024',
    cause: 'Overwatered',
    status: 'Departed',
    epitaph: '"He was a dramatic soul who couldn\'t handle the draft from the window. Or the four gallons of water I gave him on Tuesday. Rest in peat."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTTlN0B7TFo6s37rX45d0-7YdmLEGEJwW8pVYIMWzJhw7faQ32f1bXrF93Pe6tCdiO_xpZs1iart4QpjibNNLYYA0kV5S97LN2CXZkdSSo6S2UhRtc46QFpTHV5sI5ohtRDxY9zYhHwOe686pXs13EAFQFt9w8c62wWGRfaFm9-uJPpCyEp0OEorFNANzEs5Yzh7nHf1mh6eaZ32gX5wlb87_XoN9T7qr-Kk1ZmmCZHaTSJBL5gcAf9ykwgJVOPxPCaLK4aTy5Aak'
  },
  {
    id: 'd2',
    name: 'The Unnamed Succulent',
    species: 'Succulent',
    period: 'Jan — Feb 2024',
    cause: 'Forgot',
    status: 'Ascended',
    epitaph: '"Lived on a shelf. Died on a shelf. I literally forgot you were there until the dust started looking green. You deserved a window."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJU4RlrqFnOz-LElYz63a3SAjUnxycTTUjhZ-Y1hQMxNP8tFGJsVKCQTyFa9ImhEUVXcPmSjBXPjI4pvD5Jd_5GT8FhZNGMS9xNEpP1J6cqGLhVzRFs3guCCQlfdzgTmbzvQFqtbP77ZSPOcTXWoyJfu8LPcJGeeRbpsSx4dKBCSX7MMzvtStd0S347ISzWRJJdiTyYRhMenRk8_UqfkYdzoLptfKPZT5r69U8IMZFBNIMt3lvCCB0Js2keE9_67Xnh8IbI0wddWM'
  },
  {
    id: 'd3',
    name: 'Delilah the Maidenhair',
    species: 'Maidenhair Fern',
    period: '2022 — 2023',
    cause: 'Low Humidity',
    status: 'Crispy',
    epitaph: '"She demanded a rainforest and I gave her a studio apartment in Arizona. She expressed her displeasure by becoming a tumbleweed."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqqvop89E0ReStPaaoIwSAEquEP4Iq1url6lpl3S0kCHIK5-2w92CJHEishKeoPsi5pcQa55gxZI1OKwf_liqk1rQzrNt30SnMSx0zjNMXyBLiuBga93TdZiqzXrw-Q633LAl887uKMk25UhWM7bs5GO164aX6qt6ixRtyr92PTTLrTsxOpSnWeAzXXqNTjKZ_hAP2ppfctw9bMznxOgCUQUmpAB5C5JigJFuQhR1Ef2NfnwYOvHwC0pFp4QNeJCeT4GXoxp53urA'
  }
];
