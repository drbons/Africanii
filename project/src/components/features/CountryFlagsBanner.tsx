import React from 'react';

const africanCountries = [
  { code: 'dz', name: 'Algeria' },
  { code: 'ao', name: 'Angola' },
  { code: 'bj', name: 'Benin' },
  { code: 'bw', name: 'Botswana' },
  { code: 'bf', name: 'Burkina Faso' },
  { code: 'bi', name: 'Burundi' },
  { code: 'cm', name: 'Cameroon' },
  { code: 'cv', name: 'Cape Verde' },
  { code: 'cf', name: 'Central African Republic' },
  { code: 'td', name: 'Chad' },
  { code: 'km', name: 'Comoros' },
  { code: 'cg', name: 'Congo' },
  { code: 'cd', name: 'DR Congo' },
  { code: 'dj', name: 'Djibouti' },
  { code: 'eg', name: 'Egypt' },
  { code: 'gq', name: 'Equatorial Guinea' },
  { code: 'er', name: 'Eritrea' },
  { code: 'et', name: 'Ethiopia' },
  { code: 'ga', name: 'Gabon' },
  { code: 'gm', name: 'Gambia' },
  { code: 'gh', name: 'Ghana' },
  { code: 'gn', name: 'Guinea' },
  { code: 'gw', name: 'Guinea-Bissau' },
  { code: 'ci', name: 'Ivory Coast' },
  { code: 'ke', name: 'Kenya' },
  { code: 'ls', name: 'Lesotho' },
  { code: 'lr', name: 'Liberia' },
  { code: 'ly', name: 'Libya' },
  { code: 'mg', name: 'Madagascar' },
  { code: 'mw', name: 'Malawi' },
  { code: 'ml', name: 'Mali' },
  { code: 'mr', name: 'Mauritania' },
  { code: 'mu', name: 'Mauritius' },
  { code: 'ma', name: 'Morocco' },
  { code: 'mz', name: 'Mozambique' },
  { code: 'na', name: 'Namibia' },
  { code: 'ne', name: 'Niger' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'rw', name: 'Rwanda' },
  { code: 'st', name: 'São Tomé and Príncipe' },
  { code: 'sn', name: 'Senegal' },
  { code: 'sc', name: 'Seychelles' },
  { code: 'sl', name: 'Sierra Leone' },
  { code: 'so', name: 'Somalia' },
  { code: 'za', name: 'South Africa' },
  { code: 'ss', name: 'South Sudan' },
  { code: 'sd', name: 'Sudan' },
  { code: 'sz', name: 'Eswatini' },
  { code: 'tz', name: 'Tanzania' },
  { code: 'tg', name: 'Togo' },
  { code: 'tn', name: 'Tunisia' },
  { code: 'ug', name: 'Uganda' },
  { code: 'zm', name: 'Zambia' },
  { code: 'zw', name: 'Zimbabwe' }
];

const CountryFlagsBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white shadow-sm py-4">
      <div className="flex flag-container">
        {/* First set of flags */}
        {africanCountries.map((country) => (
          <div
            key={country.code}
            className="flex flex-col items-center mx-4 flex-shrink-0"
          >
            <img
              src={`https://flagcdn.com/w40/${country.code}.png`}
              alt={country.name}
              className="w-10 h-6 object-cover rounded"
            />
            <span className="text-xs mt-1 text-gray-600">{country.name}</span>
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {africanCountries.map((country) => (
          <div
            key={`${country.code}-duplicate`}
            className="flex flex-col items-center mx-4 flex-shrink-0"
          >
            <img
              src={`https://flagcdn.com/w40/${country.code}.png`}
              alt={country.name}
              className="w-10 h-6 object-cover rounded"
            />
            <span className="text-xs mt-1 text-gray-600">{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryFlagsBanner;