/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 */

import React from "react";
import pntFlag from "../../../../public/flags/points.png";

import aedFlag from "../../../../public/flags/united-arab-emirates.png";
import adpFlag from "../../../../public/flags/andorra.png";
import afnFlag from "../../../../public/flags/afghanistan.png";
import allFlag from "../../../../public/flags/albania.png";
import amdFlag from "../../../../public/flags/armenia.png";
import angFlag from "../../../../public/flags/sint-maarten.png";
// import angFlag from '../../../../public/flags/curacao.png.png';
import aoaFlag from "../../../../public/flags/angola.png";
import arsFlag from "../../../../public/flags/argentina.png";
import audFlag from "../../../../public/flags/australia.png";
import awgFlag from "../../../../public/flags/aruba.png";
import aznFlag from "../../../../public/flags/azerbaijan.png";
import bamFlag from "../../../../public/flags/bosnia-and-herzegovina.png";
import bbdFlag from "../../../../public/flags/barbados.png";
import bdtFlag from "../../../../public/flags/bangladesh.png";
import bgnFlag from "../../../../public/flags/bulgaria.png";
import bhdFlag from "../../../../public/flags/bahrain.png";
import bifFlag from "../../../../public/flags/burundi.png";
import bmdFlag from "../../../../public/flags/bermuda.png";
import bndFlag from "../../../../public/flags/brunei.png";
import bovFlag from "../../../../public/flags/bolivia.png";
import brlFlag from "../../../../public/flags/brazil.png";
import bsdFlag from "../../../../public/flags/bahamas.png";
// import btnFlag from '../../../../public/flags/bhutan.png';
import btnFlag from "../../../../public/flags/bhutan-1.png";
import bwpFlag from "../../../../public/flags/botswana.png";
import bynFlag from "../../../../public/flags/belarus.png";
import bzdFlag from "../../../../public/flags/belize.png";
import cadFlag from "../../../../public/flags/canada.png";
import cdfFlag from "../../../../public/flags/democratic-republic-of-congo.png";
// import cdfFlag from '../../../../public/flags/republic-of-the-congo.png';
import cheFlag from "../../../../public/flags/switzerland.png";
import clfFlag from "../../../../public/flags/chile.png";
import cnyFlag from "../../../../public/flags/china.png";
import copFlag from "../../../../public/flags/colombia.png";
import crcFlag from "../../../../public/flags/costa-rica.png";
import cucFlag from "../../../../public/flags/cuba.png";
import cveFlag from "../../../../public/flags/cape-verde.png";
import czkFlag from "../../../../public/flags/czech-republic.png";
import djfFlag from "../../../../public/flags/djibouti.png";
import dkkFlag from "../../../../public/flags/denmark.png";
// import dkkFlag from '../../../../public/flags/faroe-islands.png'
// import dkkFlag from '../../../../public/flags/greenland.png.png'
import dopFlag from "../../../../public/flags/dominican-republic.png";
import dzdFlag from "../../../../public/flags/algeria.png";
import egpFlag from "../../../../public/flags/egypt.png";
import ernFlag from "../../../../public/flags/eritrea.png";
import etbFlag from "../../../../public/flags/ethiopia.png";
import eurFlag from "../../../../public/flags/european-union.png";
import fjdFlag from "../../../../public/flags/fiji.png";
import fkpFlag from "../../../../public/flags/falkland-islands.png";
import gbpFlag from "../../../../public/flags/united-kingdom.png";
import gelFlag from "../../../../public/flags/georgia.png";
import ghsFlag from "../../../../public/flags/ghana.png";
import gipFlag from "../../../../public/flags/gibraltar.png";
import gmdFlag from "../../../../public/flags/gambia.png";
import gnfFlag from "../../../../public/flags/guinea.png";
import gtqFlag from "../../../../public/flags/guatemala.png";
import gydFlag from "../../../../public/flags/guyana.png";
import hkdFlag from "../../../../public/flags/hong-kong.png";
import hnlFlag from "../../../../public/flags/honduras.png";
import hrkFlag from "../../../../public/flags/croatia.png";
import htgFlag from "../../../../public/flags/haiti.png";
import hufFlag from "../../../../public/flags/hungary.png";
import idrFlag from "../../../../public/flags/indonesia.png";
import ilsFlag from "../../../../public/flags/israel.png";
import inrFlag from "../../../../public/flags/india.png";
// import inrFlag from '../../../../public/flags/bhutan-1.png';
import iqdFlag from "../../../../public/flags/iraq.png";
import irrFlag from "../../../../public/flags/iran.png";
import iskFlag from "../../../../public/flags/iceland.png";
import jmdFlag from "../../../../public/flags/jamaica.png";
import jodFlag from "../../../../public/flags/jordan.png";
import jpyFlag from "../../../../public/flags/japan.png";
import kesFlag from "../../../../public/flags/kenya.png";
import kgsFlag from "../../../../public/flags/kyrgyzstan.png";
import khrFlag from "../../../../public/flags/cambodia.png";
import kmfFlag from "../../../../public/flags/comoros.png";
import kpwFlag from "../../../../public/flags/north-korea.png";
import krwFlag from "../../../../public/flags/south-korea.png";
import kwdFlag from "../../../../public/flags/kuwait.png";
import kydFlag from "../../../../public/flags/cayman-islands.png";
import kztFlag from "../../../../public/flags/kazakhstan.png";
import lakFlag from "../../../../public/flags/laos.png";
import lbpFlag from "../../../../public/flags/lebanon.png";
import lkrFlag from "../../../../public/flags/sri-lanka.png";
import lrdFlag from "../../../../public/flags/liberia.png";
import lslFlag from "../../../../public/flags/lesotho.png";
import lydFlag from "../../../../public/flags/libya.png";
import madFlag from "../../../../public/flags/morocco.png";
import mdlFlag from "../../../../public/flags/moldova.png";
import mgaFlag from "../../../../public/flags/madagascar.png";
import mkdFlag from "../../../../public/flags/republic-of-macedonia.png";
import mmkFlag from "../../../../public/flags/myanmar.png";
import mntFlag from "../../../../public/flags/mongolia.png";
import mopFlag from "../../../../public/flags/macao.png";
import mruFlag from "../../../../public/flags/mauritania.png";
import murFlag from "../../../../public/flags/mauritius.png";
import mvrFlag from "../../../../public/flags/maldives.png";
import mwkFlag from "../../../../public/flags/malawi.png";
import mxnFlag from "../../../../public/flags/mexico.png";
import myrFlag from "../../../../public/flags/malaysia.png";
import mznFlag from "../../../../public/flags/mozambique.png";
import nadFlag from "../../../../public/flags/namibia.png";
import ngnFlag from "../../../../public/flags/nigeria.png";
import nioFlag from "../../../../public/flags/nicaragua.png";
import nokFlag from "../../../../public/flags/norway.png";
import nprFlag from "../../../../public/flags/nepal.png";
import nzdFlag from "../../../../public/flags/new-zealand.png";
import omrFlag from "../../../../public/flags/oman.png";
import pabFlag from "../../../../public/flags/panama.png";
import penFlag from "../../../../public/flags/peru.png";
import pgkFlag from "../../../../public/flags/papua-new-guinea.png";
import phpFlag from "../../../../public/flags/philippines.png";
import pkrFlag from "../../../../public/flags/pakistan.png";
import plnFlag from "../../../../public/flags/republic-of-poland.png";
import pygFlag from "../../../../public/flags/paraguay.png";
import qarFlag from "../../../../public/flags/qatar.png";
import ronFlag from "../../../../public/flags/romania.png";
import rsdFlag from "../../../../public/flags/serbia.png";
import rubFlag from "../../../../public/flags/russia.png";
import rwfFlag from "../../../../public/flags/rwanda.png";
import sarFlag from "../../../../public/flags/saudi-arabia.png";
import sbdFlag from "../../../../public/flags/solomon-islands.png";
import scrFlag from "../../../../public/flags/seychelles.png";
import sdgFlag from "../../../../public/flags/sudan.png";
import sekFlag from "../../../../public/flags/sweden.png";
import sgdFlag from "../../../../public/flags/singapore.png";
// import shpFlag not sure which flag to put here
import sllFlag from "../../../../public/flags/sierra-leone.png";
import sosFlag from "../../../../public/flags/somalia.png";
import srdFlag from "../../../../public/flags/suriname.png";
import sspFlag from "../../../../public/flags/south-sudan.png";
import stnFlag from "../../../../public/flags/sao-tome-and-principe.png";
import svcFlag from "../../../../public/flags/salvador.png";
import sypFlag from "../../../../public/flags/syria.png";
// import szlFlag not sure which flag to put here
import thbFlag from "../../../../public/flags/thailand.png";
import tjsFlag from "../../../../public/flags/tajikistan.png";
import tmtFlag from "../../../../public/flags/turkmenistan.png";
import tndFlag from "../../../../public/flags/tunisia.png";
import topFlag from "../../../../public/flags/tonga.png";
import tryFlag from "../../../../public/flags/turkey.png";
import ttdFlag from "../../../../public/flags/trinidad-and-tobago.png";
import twdFlag from "../../../../public/flags/taiwan.png";
import tzsFlag from "../../../../public/flags/tanzania.png";
import uahFlag from "../../../../public/flags/ukraine.png";
import ugxFlag from "../../../../public/flags/uganda.png";
import usdFlag from "../../../../public/flags/united-states-of-america.png";
import uyiFlag from "../../../../public/flags/uruguay.png";
import uzsFlag from "../../../../public/flags/uzbekistn.png";
import vesFlag from "../../../../public/flags/venezuela.png";
import vndFlag from "../../../../public/flags/vietnam.png";
import vuvFlag from "../../../../public/flags/vanuatu.png";
import wstFlag from "../../../../public/flags/samoa.png";
import xafFlag from "../../../../public/flags/central-african-republic.png";
// import xafFlag from '../../../../public/flags/cameroon.png';
// import xafFlag from '../../../../public/flags/republic-of-the-congo.png';
// import xafFlag from '../../../../public/flags/chad.png';
// import xafFlag from '../../../../public/flags/equatorial-guinea.png';
// import xafFlag from '../../../../public/flags/gabon.png';
// import xagFlag
// import xauFlag  not sure which flag to put here
// import xbaFlag not sure which flag to put here
// import xbbFlag
// import xbcFlag
// import xbdFlag
// import xcdFlag east caribbean countries
// import xdrFlag
import xofFlag from "../../../../public/flags/benin.png"; // west african countries
// import xofFlag from '../../../../public/flags/burkina-faso.png.png';
// import xofFlag from '../../../../public/flags/ivory-coast.png';
// import xofFlag from '../../../../public/flags/guinea-bissau.png';
// import xofFlag from '../../../../public/flags/mali.png';
// import xofFlag from '../../../../public/flags/niger.png';
// import xofFlag from '../../../../public/flags/senegal.png';
// import xofFlag from '../../../../public/flags/togo.png';
// import xpdFlag
import xpfFlag from "../../../../public/flags/france.png";
// import xptFlag
// import xsuFlag
// import xtsFlag
// import xuaFlag
// import xxxFlag
import yerFlag from "../../../../public/flags/yemen.png";
import zarFlag from "../../../../public/flags/south-africa.png";
// import zarFlag from '../../../../public/flags/lesotho.png'; //south african countries
// import zarFlag from '../../../../public/flags/namibia.png';
// import zarFlag from '../../../../public/flags/eswatini.png';
import zmwFlag from "../../../../public/flags/zambia.png";
import zwlFlag from "../../../../public/flags/zimbabwe.png";

interface ICountryCodeToFlag {
  countryCode: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const flagLookup = new Map([
  ["ARE", aedFlag],
  ["ADP", adpFlag],
  ["AFG", afnFlag],
  ["ALB", allFlag],
  ["AMD", amdFlag],
  ["ANG", angFlag],
  ["AOA", aoaFlag],
  ["ARS", arsFlag],
  ["AUS", audFlag],
  ["AWG", awgFlag],
  ["AZN", aznFlag],
  ["BAM", bamFlag],
  ["BBD", bbdFlag],
  ["BDT", bdtFlag],
  ["BGN", bgnFlag],
  ["BHR", bhdFlag],
  ["BIF", bifFlag],
  ["BMD", bmdFlag],
  ["BND", bndFlag],
  ["BOB", bovFlag],
  ["BOV", bovFlag],
  ["BRA", brlFlag],
  ["BHS", bsdFlag],
  ["BTN", btnFlag],
  ["BWP", bwpFlag],
  ["BYN", bynFlag],
  ["BZD", bzdFlag],
  ["CAN", cadFlag],
  ["CDF", cdfFlag],
  ["CHE", cheFlag],
  ["CHF", cheFlag],
  ["CHW", cheFlag],
  ["CHL", clfFlag],
  ["CLP", clfFlag],
  ["CHN", cnyFlag],
  ["COP", copFlag],
  ["COU", copFlag],
  ["CRC", crcFlag],
  ["CUC", cucFlag],
  ["CUP", cucFlag],
  ["CVE", cveFlag],
  ["CZE", czkFlag],
  ["DJF", djfFlag],
  ["DNK", dkkFlag],
  ["DOP", dopFlag],
  ["DZA", dzdFlag],
  ["EGP", egpFlag],
  ["ERN", ernFlag],
  ["ETB", etbFlag],
  ["EUR", eurFlag],
  ["FJD", fjdFlag],
  ["FKP", fkpFlag],
  ["GBR", gbpFlag],
  ["GEL", gelFlag],
  ["GHS", ghsFlag],
  ["GIP", gipFlag],
  ["GMD", gmdFlag],
  ["GNF", gnfFlag],
  ["GTQ", gtqFlag],
  ["GYD", gydFlag],
  ["HKG", hkdFlag],
  ["HNL", hnlFlag],
  ["HRK", hrkFlag],
  ["HTG", htgFlag],
  ["HUN", hufFlag],
  ["IDN", idrFlag],
  ["ILS", ilsFlag],
  ["IND", inrFlag],
  ["IRQ", iqdFlag],
  ["IRR", irrFlag],
  ["ISL", iskFlag],
  ["JMD", jmdFlag],
  ["JOR", jodFlag],
  ["JPN", jpyFlag],
  ["KES", kesFlag],
  ["KGS", kgsFlag],
  ["KHR", khrFlag],
  ["KMF", kmfFlag],
  ["PRK", kpwFlag],
  ["KOR", krwFlag],
  ["KWT", kwdFlag],
  ["KYD", kydFlag],
  ["KZT", kztFlag],
  ["LAK", lakFlag],
  ["LBP", lbpFlag],
  ["LKR", lkrFlag],
  ["LRD", lrdFlag],
  ["LSL", lslFlag],
  ["LYD", lydFlag],
  ["MAD", madFlag],
  ["MDL", mdlFlag],
  ["MGA", mgaFlag],
  ["MKD", mkdFlag],
  ["MMK", mmkFlag],
  ["MNT", mntFlag],
  ["MOP", mopFlag],
  ["MRU", mruFlag],
  ["MUR", murFlag],
  ["MVR", mvrFlag],
  ["MWK", mwkFlag],
  ["MEX", mxnFlag],
  ["MXV", mxnFlag],
  ["MYS", myrFlag],
  ["MZN", mznFlag],
  ["NAD", nadFlag],
  ["NGN", ngnFlag],
  ["NIO", nioFlag],
  ["NOR", nokFlag],
  ["NPR", nprFlag],
  ["NZL", nzdFlag],
  ["OMR", omrFlag],
  ["PAN", pabFlag],
  ["PER", penFlag],
  ["PGK", pgkFlag],
  ["PHL", phpFlag],
  ["PKR", pkrFlag],
  ["POL", plnFlag],
  ["PYG", pygFlag],
  ["QAT", qarFlag],
  ["RON", ronFlag],
  ["RSD", rsdFlag],
  ["RUB", rubFlag],
  ["RWF", rwfFlag],
  ["SAU", sarFlag],
  ["SBD", sbdFlag],
  ["SCR", scrFlag],
  ["SDG", sdgFlag],
  ["SWE", sekFlag],
  ["SGP", sgdFlag],
  // ["SHP", shpFlag],
  ["SLL", sllFlag],
  ["SOS", sosFlag],
  ["SRD", srdFlag],
  ["SSP", sspFlag],
  ["STN", stnFlag],
  ["SVC", svcFlag],
  ["SYP", sypFlag],
  // ["SZL", szlFlag],
  ["THA", thbFlag],
  ["TJS", tjsFlag],
  ["TMT", tmtFlag],
  ["TND", tndFlag],
  ["TOP", topFlag],
  ["TRY", tryFlag],
  ["TTD", ttdFlag],
  ["TWN", twdFlag],
  ["TZS", tzsFlag],
  ["UAH", uahFlag],
  ["UGX", ugxFlag],
  ["USD", usdFlag],
  ["USA", usdFlag],
  ["US", usdFlag],
  ["USN", usdFlag],
  ["UYI", uyiFlag],
  ["UYU", uyiFlag],
  ["UZS", uzsFlag],
  ["VES", vesFlag],
  ["VND", vndFlag],
  ["VUV", vuvFlag],
  ["ASM", wstFlag],
  ["XAF", xafFlag],
  // ["XAG", xagFlag],
  // ["XAU", xauFlag],
  // ["XBA", xbaFlag],
  // ["XBB", xbbFlag],
  // ["XBC", xbcFlag],
  // ["XBD", xbdFlag],
  // ["XCD", xcdFlag],
  // ["XDR", xdrFlag],
  ["XOF", xofFlag],
  // ["XPD", xpdFlag],
  ["FRA", xpfFlag],
  // ["XPT", xptFlag],
  // ["XSU", xsuFlag],
  // ["XTS", xtsFlag],
  // ["XUA", xuaFlag],
  // ["XXX", xxxFlag],
  ["YER", yerFlag],
  ["ZAR", zarFlag],
  ["ZMW", zmwFlag],
  ["ZWL", zwlFlag],
  ["POINT", pntFlag],
]);

const CountryCodeToFlag: React.FC<ICountryCodeToFlag> = ({
  countryCode,
  width,
  height,
  className,
}) => {

  const countryFlag = flagLookup.get(countryCode);

  return (
    <>
    { countryFlag ? (
      <img
        width={width}
        height={height}
        className={className}
        src={flagLookup.get(countryCode)}
        alt={`${countryCode} flag`}
      />
    ): ""}
    </>
  );
};
export default CountryCodeToFlag;
