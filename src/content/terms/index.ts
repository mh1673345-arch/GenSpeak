import { expandTerm, type RawTerm, type Term } from "../types";

import { aestheticTerms } from "./aesthetic";
import { aiTerms } from "./ai";
import { animeTerms } from "./anime";
import { datingTerms } from "./dating";
import { discourseTerms } from "./discourse";
import { fandomTerms } from "./fandom";
import { gamingTerms } from "./gaming";
import { memeTerms } from "./meme";
import { oldwebTerms } from "./oldweb";
import { slangTerms } from "./slang";
import { socialTerms } from "./social";
import { streamTerms } from "./stream";
import { techTerms } from "./tech";
import { textTerms } from "./text";
import { web3Terms } from "./web3";
import { workTerms } from "./work";

const raw: RawTerm[] = [
  ...slangTerms,
  ...memeTerms,
  ...aiTerms,
  ...gamingTerms,
  ...socialTerms,
  ...web3Terms,
  ...fandomTerms,
  ...workTerms,
  ...oldwebTerms,
  ...techTerms,
  ...streamTerms,
  ...animeTerms,
  ...aestheticTerms,
  ...datingTerms,
  ...discourseTerms,
  ...textTerms,
];

export const terms: Term[] = raw.map(expandTerm);
export type { Term };
