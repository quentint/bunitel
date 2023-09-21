/**
 * Minitel universe constants
 */

export const NUL = 0x00 // null
export const SOH = 0x01 // start of heading
export const STX = 0x02 // start of text
export const ETX = 0x03 // end of text
export const EOT = 0x04 // end of transmission
export const ENQ = 0x05 // enquiry
export const ACK = 0x06 // acknowledge
export const BEL = 0x07 // bell
export const BS = 0x08 // backspace
export const TAB = 0x09 // horizontal tab
export const LF = 0x0a // line feed, new line
export const VT = 0x0b // vertical tab
export const FF = 0x0c // form feed, new page
export const CR = 0x0d // carriage return
export const SO = 0x0e // shift out
export const SI = 0x0f // shift in
export const DLE = 0x10 // data link escape
export const DC1 = 0x11 // device control 1
export const CON = 0x11 // Cursor on
export const DC2 = 0x12 // device control 2
export const REP = 0x12 // Rep
export const DC3 = 0x13 // device control 3
export const SEP = 0x13 // Sep
export const DC4 = 0x14 // device control 4
export const COF = 0x14 // Cursor off
export const NAK = 0x15 // negative acknowledge
export const SYN = 0x16 // synchronous idle
export const ETB = 0x17 // end of transmission block
export const CAN = 0x18 // cancel
export const EM = 0x19 // end of medium
export const SS2 = 0x19 // SS2
export const SUB = 0x1a // substitute
export const ESC = 0x1b // escape
export const FS = 0x1c // file separator
export const GS = 0x1d // group separator
export const SS3 = 0x1d // SS3
export const RS = 0x1e // record separator
export const US = 0x1f // unit separator

export const PRO1 = [ESC, 0x39] // protocole 1
export const PRO2 = [ESC, 0x3a] // protocole 2
export const PRO3 = [ESC, 0x3b] // protocole 3
export const CSI = [ESC, 0x5b] // CSI

// PRO1 commands
export const DECONNEXION = 0x67
// export const CONNEXION = 0x68
export const RET1 = 0x6c
export const RET2 = 0x6d
export const OPPO = 0x6f
export const STATUS_TERMINAL = 0x70
export const STATUS_CLAVIER = 0x72
export const STATUS_FONCTIONNEMENT = 0x72
export const STATUS_VITESSE = 0x74
export const STATUS_PROTOCOLE = 0x76
export const ENQROM = 0x7b
export const RESET = 0x7f

// PRO2 commands
export const COPIE = 0x7c
export const AIGUILLAGE_TO = 0x62
export const NON_DIFFUSION = 0x64
export const NON_RETOUR_ACQUITTEMENT = 0x64
export const DIFFUSION = 0x65
export const RETOUR_ACQUITTEMENT = 0x65
export const TRANSPARENCE = 0x66
export const START = 0x69
export const STOP = 0x6a
export const PROG = 0x6b
export const REP_STATUS_CLAVIER = 0x73
export const REP_STATUS_FONCTIONNEMENT = 0x73
export const REP_STATUS_PROTOCOLE = 0x77
export const TELINFO = [0x31, 0x7d]
export const MIXTE1 = [0x32, 0x7d]
export const MIXTE2 = [0x32, 0x7e]

// PRO3 commands
export const AIGUILLAGE_OFF = 0x60
export const AIGUILLAGE_ON = 0x61
export const AIGUILLAGE_FROM = 0x63

// PRO command lengths
export const LONGUEUR_PRO1 = 3
export const LONGUEUR_PRO2 = 4
export const LONGUEUR_PRO3 = 5

// Other codes
export const COPIE_FRANCAIS = 0x6a
export const COPIE_AMERICAIN = 0x6b
export const ETEN = 0x41
// export const C0 = 0x43

// PRO2+START/STOP codes
export const ROULEAU = 0x43
export const PROCEDURE = 0x44
export const MINUSCULES = 0x45

// PRO2+PROG codes
export const B9600 = 0x7f
export const B4800 = 0x76
export const B1200 = 0x64
export const B300 = 0x52

// PRO3+START/STOP codes
export const C0 = 0x43

// Receiving codes
export const RCPT_ECRAN = 0x58
export const RCPT_CLAVIER = 0x59
export const RCPT_MODEM = 0x5a
export const RCPT_PRISE = 0x5b

// Emission codes
export const EMET_ECRAN = 0x50
export const EMET_CLAVIER = 0x51
export const EMET_MODEM = 0x52
export const EMET_PRISE = 0x53

// Accents
export const ACCENT_CEDILLE = [SS2, 0x4b]
export const ACCENT_GRAVE = [SS2, 0x41]
export const ACCENT_AIGU = [SS2, 0x42]
export const ACCENT_CIRCONFLEXE = [SS2, 0x43]
export const ACCENT_TREMA = [SS2, 0x48]

// Direction keys
export const HAUT = [CSI, 0x41]
export const BAS = [CSI, 0x42]
export const GAUCHE = [CSI, 0x44]
export const DROITE = [CSI, 0x43]

export const MAJ_HAUT = [CSI, 0x4D]
export const MAJ_BAS = [CSI, 0x4C]
export const MAJ_GAUCHE = [CSI, 0x50]
export const MAJ_DROITE = [CSI, 0x34, 0x68]

export const CTRL_GAUCHE = 0x7f

// Enter/Carriage return key
export const ENTREE = 0x0d
export const MAJ_ENTREE = [CSI, 0x48]
export const CTRL_ENTREE = [CSI, 0x32, 0x4a]

// Function keys
export const ENVOI = [DC3, 0x41]
export const RETOUR = [DC3, 0x42]
export const REPETITION = [DC3, 0x43]
export const GUIDE = [DC3, 0x44]
export const ANNULATION = [DC3, 0x45]
export const SOMMAIRE = [DC3, 0x46]
export const CORRECTION = [DC3, 0x47]
export const SUITE = [DC3, 0x48]
export const CONNEXION = [DC3, 0x49]

// Minitel types
export const TYPE_MINITELS: {[key: string]: any} = {
  'b': {
    'nom': 'Minitel 1',
    'retournable': false,
    'clavier': 'ABCD',
    'vitesse': 1200,
    '80colonnes': false,
    'caracteres': false,
  },
  'c': {
    'nom': 'Minitel 1',
    'retournable': false,
    'clavier': 'Azerty',
    'vitesse': 1200,
    '80colonnes': false,
    'caracteres': false,
  },
  // ... more minitel types here
}

// ... other constants, similar to the ones above.