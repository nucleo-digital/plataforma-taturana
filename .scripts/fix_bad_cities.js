function slug(s, opt) {
  /**
   * Create a web friendly URL slug from a string.
   *
   * Requires XRegExp (http://xregexp.com) with unicode add-ons for UTF-8 support.
   *
   * Although supported, transliteration is discouraged because
   *     1) most web browsers support UTF-8 characters in URLs
   *     2) transliteration causes a loss of information
   *
   * @author Sean Murphy <sean@iamseanmurphy.com>
   * @copyright Copyright 2012 Sean Murphy. All rights reserved.
   * @license http://creativecommons.org/publicdomain/zero/1.0/
   *
   * @param string s
   * @param object opt
   * @return string
   */
    s = String(s);
    opt = Object(opt);

    var defaults = {
        'delimiter': '-',
        'limit': undefined,
        'lowercase': true,
        'replacements': {},
        'transliterate': (typeof(XRegExp) === 'undefined') ? true : false
    };

    // Merge options
    for (var k in defaults) {
        if (!opt.hasOwnProperty(k)) {
            opt[k] = defaults[k];
        }
    }

    var char_map = {
        // Latin
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ő': 'O',
        'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH',
        'ß': 'ss',
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
        'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
        'ÿ': 'y',

        // Latin symbols
        '©': '(c)',

        // Greek
        'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
        'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
        'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
        'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
        'Ϋ': 'Y',
        'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
        'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
        'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
        'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
        'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',

        // Turkish
        'Ş': 'S', 'İ': 'I', 'Ç': 'C', 'Ü': 'U', 'Ö': 'O', 'Ğ': 'G',
        'ş': 's', 'ı': 'i', 'ç': 'c', 'ü': 'u', 'ö': 'o', 'ğ': 'g',

        // Russian
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
        'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya',

        // Ukrainian
        'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
        'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',

        // Czech
        'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U',
        'Ž': 'Z',
        'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
        'ž': 'z',

        // Polish
        'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ó': 'o', 'Ś': 'S', 'Ź': 'Z',
        'Ż': 'Z',
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
        'ż': 'z',

        // Latvian
        'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i', 'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N',
        'Š': 'S', 'Ū': 'u', 'Ž': 'Z',
        'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
        'š': 's', 'ū': 'u', 'ž': 'z',

        // accents
        "'": "-", '"': '-', '`': '-', '´': '-', '\^': '-'
    };

    // Make custom replacements
    for (var k in opt.replacements) {
        s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
    }

    // Transliterate characters to ASCII
    if (opt.transliterate) {
        for (var k in char_map) {
            s = s.replace(RegExp(k, 'g'), char_map[k]);
        }
    }

    // Replace non-alphanumeric characters with our delimiter
    var alnum = (typeof(XRegExp) === 'undefined') ? RegExp('[^a-z0-9]+', 'ig') : XRegExp('[^\\p{L}\\p{N}]+', 'ig');
    s = s.replace(alnum, opt.delimiter);

    // Remove duplicate delimiters
    s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter);

    // Truncate slug to max. characters
    s = s.substring(0, opt.limit);

    // Remove delimiter from ends
    s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '');

    return opt.lowercase ? s.toLowerCase() : s;
}


function toTitleCase(str) {
    return str.replace(
      /\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}
    ).replace(
      /\s([a-zA-Z]{1,2})\s/g, function(s) { return s.toLowerCase()} // De > de, O > o, etc
    );
}

bad_cities_fix = [
  [{'s_country': 'BRASIL'}, {'s_country': 'Brasil'}],
  [{"uf": "AC", "city": ""}, {delete:1}],
  [{"uf": "AC", "city": "*"}, {delete:1}],
  [{"uf": "AC", "city": "**"}, {delete:1}],
  [{"uf": "AC", "city": "***"}, {delete:1}],
  [{"uf": "AC", "city": "****"}, {delete:1}],
  [{"uf": "AC", "city": ","}, {delete:1}],
  [{"uf": "AC", "city": "Barretos"}],
  [{"uf": "AC", "city": "Bebedouro"}],
  [{"uf": "AC", "city": "Belo Horizonte"}],
  [{"uf": "AC", "city": "Bogotá"}, {'s_country': 'Colômbia', uf: 'D.C.'}],
  [{"uf": "AC", "city": "Brasilia"}, {city: 'Brasília'},],
  [{"uf": "AC", "city": "C"}, {delete:1}],
  [{"uf": "AC", "city": "Cachoeiras de Macacu"}],
  [{"uf": "AC", "city": "Caraguatatuba"}],
  [{"uf": "AC", "city": "Carmo"}],
  [{"uf": "AC", "city": "Caxias do Sul"}],
  [{"uf": "AC", "city": "Conceição de Macabu"}],
  [{"uf": "AC", "city": "Cravinhos"}],
  [{"uf": "AC", "city": "Cubatão"}],
  [{"uf": "AC", "city": "Curitiba"}],
  [{"uf": "AC", "city": "Divinópolis"}],
  [{"uf": "AC", "city": "Duque de Caxias"}],
  [{"uf": "AC", "city": "Elisiario"}, {city:'Elisiário'}],
  [{"uf": "AC", "city": "Espirito Santo do Pinhal"}, {"city": "Espirito Santo do Pinhal"}],
  [{"uf": "AC", "city": "Ferraz de Vasconcelos"}],
  [{"uf": "AC", "city": "Fortaleza"}],
  [{"uf": "AC", "city": "Foz do Iguaçu"}],
  [{"uf": "AC", "city": "Franca"}],
  [{"uf": "AC", "city": "Frankfurt am Main"}, {s_country: 'Alemanha', uf: 'Hessen'}],
  [{"uf": "AC", "city": "Ipojuca"}],
  [{"uf": "AC", "city": "Jacarezinho"}],
  [{"uf": "AC", "city": "Joinville"}],
  [{"uf": "AC", "city": "Juquiá"}],
  [{"uf": "AC", "city": "Manaus"}],
  [{"uf": "AC", "city": "Miracatu"}],
  [{"uf": "AC", "city": "Monteiro Lobato"}],
  [{"uf": "AC", "city": "Montevideo"}, {s_country:'Uruguai', uf: 'Montevidéu', city: 'Montevidéu'}],
  [{"uf": "AC", "city": "Niteroirasil"}, {"city": "Niterói"}],
  [{"uf": "AC", "city": "Niterói"}],
  [{"uf": "AC", "city": "Palmares"}],
  [{"uf": "AC", "city": "Palmas"}],
  [{"uf": "AC", "city": "Pato Branco"}],
  [{"uf": "AC", "city": "Pelotas"}],
  [{"uf": "AC", "city": "Pitangueiras"}],
  [{"uf": "AC", "city": "Porto Alegre"}],
  [{"uf": "AC", "city": "Porto Seguro"}],
  [{"uf": "AC", "city": "Pouso Alegre"}],
  [{"uf": "AC", "city": "Pradópolis"}],
  [{"uf": "AC", "city": "Recife"}],
  [{"uf": "AC", "city": "Ribeirão Preto"}],
  [{"uf": "AC", "city": "Rio Das Ostras"}],
  [{"uf": "AC", "city": "Rio de Janeiro"}],
  [{"uf": "AC", "city": "Rio Pomba"}],
  [{"uf": "AC", "city": "Salvador"}],
  [{"uf": "AC", "city": "San Fransico"}, {s_country: 'Estados Unidos da América', uf: 'CA', city: "San Fransico"}],
  [{"uf": "AC", "city": "Santa Bárbara D`oeste"}],
  [{"uf": "AC", "city": "Santa Filomena"}],
  [{"uf": "AC", "city": "Santa Isabel"}],
  [{"uf": "AC", "city": "Santo Andre"}, {city: "Santo André"}],
  [{"uf": "AC", "city": "Santo André"}],
  [{"uf": "AC", "city": "Santo Antonio do Jardim"}],
  [{"uf": "AC", "city": "Sao Gonçalo"}],
  [{"uf": "AC", "city": "Sumaré"}],
  [{"uf": "AC", "city": "São Carlos"}],
  [{"uf": "AC", "city": "São Gonçalo"}],
  [{"uf": "AC", "city": "São José da Bela Vista"}],
  [{"uf": "AC", "city": "São José"}],
  [{"uf": "AC", "city": "São Luis"}],
  [{"uf": "AC", "city": "São Miguel Arcanjo"}],
  [{"uf": "AC", "city": "São Paulo"}],
  [{"uf": "AC", "city": "São Sebastião"}],
  [{"uf": "AC", "city": "Taguatinga"}],
  [{"uf": "AC", "city": "Teste"}, {delete:1}],
  [{"uf": "AC", "city": "Ubatuba"}],
  [{"uf": "AC", "city": "Vitória de Santo Antão"}],
  [{"uf": "AC", "city": "Volta Redonda"}],
  [{"uf": "AC", "city": "Votuporanga"}],
  [{"uf": "BA", "city": "Jequie"}],
  [{"uf": "BA", "city": "São Paulo"}],
  [{"uf": "CE", "city": "Crateus"}, {"city": "Crateús"}],
  [{"uf": "DF", "city": "Brasilia"}, {city: 'Brasília'}],
  [{"uf": "MA", "city": "Sao Luis"}],
  [{"uf": "MA", "city": "São Luis"}],
  [{"uf": "MG", "city": "Bh"}, {city: "Belo Horizonte"}],
  [{"uf": "MG", "city": "Padre Paraiso"}],
  [{"uf": "MG", "city": "Porto Alegre"}],
  [{"uf": "PA", "city": "Asdasd"}, {delete:1}],
  [{"uf": "PB", "city": "Aruanda"}],
  [{"uf": "PE", "city": "Jaboatão Dos Guararapes"}],
  [{"uf": "PR", "city": "Foz de Iguacu"}],
  [{"uf": "RJ", "city": "Angra Dos Reis"}],
  [{"uf": "RJ", "city": "Armação Dos Búzios"}],
  [{"uf": "RJ", "city": "Campos do Goytacazes"}],
  [{"uf": "RJ", "city": "Campos Dos Goytacazes"}],
  [{"uf": "RJ", "city": "Campos Dos Goytavcazes"}],
  [{"uf": "RJ", "city": "Conceiçao de Macabu"}],
  [{"uf": "RJ", "city": "Duqeu de Caxias"}, {"uf": "RJ", "city": "Duque de Caxias"}],
  [{"uf": "RJ", "city": "Niteroi"}],
  [{"uf": "RJ", "city": "Pirai"}],
  [{"uf": "RJ", "city": "Rio Das Ostras"}],
  [{"uf": "RJ", "city": "Rio de Janeira"}],
  [{"uf": "RJ", "city": "Rio de Janeiro, Rio de Janeiro, Brasil"}],
  [{"uf": "RJ", "city": "Rio Dejaneiro"}],
  [{"uf": "RJ", "city": "Rio Janeiro"}],
  [{"uf": "RJ", "city": "Rj"}, {"city": "Rio Janeiro"}],
  [{"uf": "RJ", "city": "S"}, {"city": "São Paulo"}],
  [{"uf": "RJ", "city": "Sao Goncalo"}, {city:'São Gonçalo'}],
  [{"uf": "RJ", "city": "Sao Gonçalo"}, {city:'São Gonçalo'}],
  [{"uf": "RJ", "city": "Sao Joao da Barra"}],
  [{"uf": "RJ", "city": "São Gonçalo, Rio de Janeiro"}, {city:'São Gonçalo'}],
  [{"uf": "RJ", "city": "São Gonçao"}, {city:'São Gonçalo'}],
  [{"uf": "SC", "city": "Florianópoli"}, {"city": "Florianópolis"}],
  [{"uf": "SC", "city": "Sao Joao do Sul"}],
  [{"uf": "SE", "city": "São Cristovão"}, {"city": "São João do Sul"}],
  [{"uf": "SE", "city": "São Paulo"}],
  [{"uf": "SP", "city": ""}, {delete:1}],
  [{"uf": "SP", "city": "**"}, {delete:1}],
  [{"uf": "SP", "city": "***"}, {delete:1}],
  [{"uf": "SP", "city": "*******"}, {delete:1}],
  [{"uf": "SP", "city": "Aguai"}, {"city": "Aguaí"}],
  [{"uf": "SP", "city": "Catigua"}, {"city": "Catiguá"}],
  [{"uf": "SP", "city": "Dirce-reis"}, {"city": "Dirce Reis"}],
  [{"uf": "SP", "city": "Embu Guaçu"}, {city:"Embu-Guaçu"}],
  [{"uf": "SP", "city": "Guaianases"}],
  [{"uf": "SP", "city": "Jundiai"}, {"city": "Jundiaí"}],
  [{"uf": "SP", "city": "Marilia"}, {"city": "Marília"}],
  [{"uf": "SP", "city": "Pindamonhanagaba"}, {city:"Pindamonhangaba"}],
  [{"uf": "SP", "city": "Presidente Epitacio"}, {"city": "Presidente Epitácio"}],
  [{"uf": "SP", "city": "Ribeirao Corrente"}, {"city": "Ribeirão Corrente"}],
  [{"uf": "SP", "city": "Ribeirao Pires"}, {"city": "Ribeirão Pires"}],
  [{"uf": "SP", "city": "Ribeirao Preto"}, {"city": "Ribeirão Preto"}],
  [{"uf": "SP", "city": "Riolandia"}, {"city": "Riolândia"}],
  [{"uf": "SP", "city": "Santa Barbara Doeste"}, {"city": "Santa Bárbara D`oeste"}],
  [{"uf": "SP", "city": "Santa Bárbara D'oeste"}, {"city": "Santa Bárbara D`oeste"}],
  [{"uf": "SP", "city": "Santa Bárbara do Oeste"}, {"city": "Santa Bárbara D`oeste"}],
  [{"uf": "SP", "city": "Santo Andre"}, {city: "Santo André"}],
  [{"uf": "SP", "city": "Sao Bernardo do Campo"}, {"city": "São Bernardo do Campo"}],
  [{"uf": "SP", "city": "Sao Jose Dos Campos"}, {"city": "São Jose Dos Campos"}],
  [{"uf": "SP", "city": "Sao Paulo"}, {"city": "São Paulo"}],
  [{"uf": "SP", "city": "Sao Sebastiao"}, {"city": "São Sebastião"}],
  [{"uf": "SP", "city": "Sto André"}, {"city": "Santo André"}],
  [{"uf": "SP", "city": "Sumare"}, {"city": "Sumaré"}],
  [{"uf": "SP", "city": "São Francisco Xavier"}],
  [{"uf": "SP", "city": "São João Das Duas Pontes"}],
  [{"uf": "SP", "city": "São João de Iarcema"}],
  [{"uf": "SP", "city": "São Paulo  Sp."}, {"city": "São Paulo"}],
  [{"uf": "SP", "city": "Taiuva"}],
  [{"uf": "SP", "city": "Turiuba"}],
  [{"uf": "SP", "city": "áGuas da Prata"}, {"city": "Águas da Prata"}],
  [{"uf": "SP", "city": "áLvares Florence"}, {"city": "Álvares Florence"}],
  [{"uf":"AC","city":"SÃO GONÇALO","country":"BRASIL"}, {"uf":"RJ","city":"São Gonçalo","country":"Brasil"}],
  [{"uf":"AC","city":"teste","country":"tes"}, {delete:1}],
  [{"uf":"AC","city":"teste","country":"teste"}, {delete:1}],
  [{"uf":"CA","city":"San Fransico","country":"Estados Unidos da América"}, {insert:1}],
  [{"uf":"D.C.","city":"Bogotá","country":"Colômbia"}, {insert:1}],
  [{"uf":"Hessen","city":"Frankfurt am Main","country":"Alemanha"}, {insert:1}],
  [{"uf":"Montevidéu","city":"Montevidéu","country":"Uruguai"}, {insert:1}],
  [{"uf":"PA","city":"asdasd","country":"asdas"}, {delete:1}],
  [{"uf":"PB","city":"Aruanda","country":"Brasil"}, {"uf":"PB","city":"Condado","country":"Brasil"}],
  [{"uf":"PR","city":"Foz de Iguacu","country":"Brasil"}, {"uf":"PR","city":"Foz do Iguaçu","country":"Brasil"}],
  [{"uf":"RJ","city":"Campos do Goytacazes","country":"Brasil"}, {"uf":"RJ","city":"Campos dos Goytacazes","country":"Brasil"}],
  [{"uf":"RJ","city":"Campos dos Goytavcazes","country":"Brasil"}, {"uf":"RJ","city":"Campos dos Goytacazes","country":"Brasil"}],
  [{"uf":"RJ","city":"RIO DAS OSTRAS","country":"Brasil"}, {"uf":"RJ","city":"Rio das Ostras","country":"Brasil"}],
  [{"uf":"RJ","city":"Rio de Janeira","country":"Brasil"}, {"uf":"RJ","city":"Rio de Janeiro","country":"Brasil"}],
  [{"uf":"RJ","city":"Rio de Janeira","country":"Brasil"}, {"uf":"RJ","city":"Rio de Janeiro","country":"Brasil"}],
  [{"uf":"RJ","city":"Rio de Janeiro, Rio de Janeiro, Brasil","country":"Brasil"}, {"uf":"RJ","city":"Rio de Janeiro","country":"Brasil"}],
  [{"uf":"RJ","city":"Rio deJaneiro","country":"Brasil"}, {"uf":"RJ","city":"Rio deJaneiro","country":"Brasil"}],
  [{"uf":"RJ","city":"rio janeiro","country":"Brasil"}, {"uf":"RJ","city":"Rio de Janeiro","country":"Brasil"}],
  [{"uf":"RJ","city":"SÃO GONÇALO, RIO DE JANEIRO","country":"Brasil"}, {"uf":"RJ","city":"São Gonçalo","country":"Brasil"}],
  [{"uf":"RJ","city":"SÃO GONÇAO","country":"BRASIL"}, {"uf":"RJ","city":"São Gonçalo","country":"BRASIL"}],
  [{"uf":"SP","city":"Guaianases","country":"Brasil"}, {"uf":"SP","city":"São Paulo","country":"Brasil"}],
  [{"uf":"SP","city":"santa barbara doeste","country":"BRASIL"}, {"uf":"SP","city":"santa barbara doeste","country":"BRASIL"}],
  [{"uf":"SP","city":"Santa Bárbara d'Oeste","country":"Brasil"}, {"uf":"SP","city":"Santa Bárbara d`Oeste","country":"Brasil"}],
  [{"uf":"SP","city":"Sto André","country":"Brasil"}, {"uf":"SP","city":"Santo André","country":"Brasil"}],
  [{"uf":"SP","city":"São Francisco Xavier","country":"Brasil"}, {"uf":"SP","city":"São José dos Campos","country":"Brasil"}],
  [{"uf":"SP","city":"SÃO JOÃO DE IARCEMA","country":"BRASIL"}, {"uf":"SP","city":"São João de Iracema","country":"BRASIL"}],
  [{"uf":"SP","city":"São Paulo  SP.","country":"Brasil"}, {"uf":"SP","city":"São Paulo","country":"Brasil"}],
  [{"uf":"MG","city":"BH","country":"Brasil"}, {"uf":"MG","city":"Belo Horizonte","country":"Brasil"}],
]
var counter_deleted = 0,
    counter_manual_fix = 0,
    counter_guessing = 0,
    counter_autoscan = 0,
    counter_auto_guess = 0,
    counter_inserted = 0;
bad_cities_fix.forEach(function(entry, index) {
  var original = entry[0],
      fix = entry[1];
  if (fix && fix.insert == 1) {
    res = db.cities.findAndModify({
      query: {slug: slug(original.city + " " + original.uf + " " + original.country)},
      update: {
        state: original.uf,
        name: original.city,
        country: original.country,
        slug: slug(original.city + " " + original.uf + " " + original.country),
        'has_screenings': false
      },
      upsert:true
    });
    counter_inserted += 1
  } else if (fix && fix.delete == 1) {
    res = db.films.update(
      {},
      {$pull: {screening: {city: original.city, uf: original.uf}}},
      {multi: true}
    );
    if (res && res.nModified > 0) { counter_deleted += res.nModified }
  } else if (fix) {
    _fix = {}
    for (var attr in fix) {
      if (fix[attr]) {
        if (attr == 'country') {
          _fix['screening.$.s_country'] = fix[attr]
        } else {
          _fix['screening.$.' + attr] = fix[attr]
        }
      }
    }
    res = db.films.update(
      {screening: {$elemMatch: {uf: original.uf,
                                city: original.city,
                                s_country: original.country}}},
      {$set: _fix},
      {multi: true}
    );
    if (res && res.nModified > 0) { counter_manual_fix += res.nModified }
  }
});
db.films.find().forEach(function(film) {
  film.screening && film.screening.forEach(function(screening) {
    _slug = slug(screening.city + " " + screening.uf + " " + screening.s_country)
    city_obj = db.cities.findOne({slug:_slug})
    if (city_obj) {
      // update screening with correct name
      res = db.films.update(
        {screening:{$elemMatch:{_id: screening._id}}},
        {$set: {'screening.$.s_country': city_obj.country,
                'screening.$.uf': city_obj.state,
                'screening.$.city': city_obj.name,}}
      );
      if (res && res.nModified > 0) {counter_autoscan += res.nModified}
    }
  });
});
bad_cities_fix.forEach(function(entry, index) {
  var original = entry[0],
      fix = entry[1];
  if (fix) { return; }
  if (db.cities.find({name: original.city}).count() == 1) {
    obj = db.cities.findOne({name:original.city})
    fix = {'screening.$.uf': obj.state,
           'screening.$.city': obj.name,
           'screening.$.s_country': obj.country};
    res = db.films.update(
      {screening: {$elemMatch: original}},
      {$set: fix},
      {multi:true}
    )
    if (res && res.nModified > 0) { counter_guessing += res.nModified }
  }
})
db.films.find().forEach(function(film) {
  film.screening && film.screening.forEach(function(screening) {
    _slug = slug(screening.city)
    city_obj = db.cities.findOne({slug: {$regex: ".*" + _slug + ".*-.*-.*"}})
    if (city_obj) {
      // update screening with correct name
      res = db.films.update(
        {screening:{$elemMatch:{_id: screening._id}}},
        {$set: {'screening.$.s_country': city_obj.country,
                'screening.$.uf': city_obj.state,
                'screening.$.city': city_obj.name,}}
      );
      if (res && res.nModified > 0) {counter_auto_guess += res.nModified}
    }
  });
});

print("Total screenings: " + db.films.distinct('screening._id').length)
print("Inserted: " + counter_inserted);
print("Deleted: " + counter_deleted);
print("Manually fixed: " + counter_manual_fix);
print("Updated by auto scan: " + counter_autoscan);
print("Guess from bad_cities: " + counter_guessing);
print("Guess from screening cities: "+ counter_auto_guess);

