import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		textShadow: {
			// Añade esta línea
			'outline': '1px 1px 0 rgba(255, 255, 255, 1), -1px -1px 0 rgba(255, 255, 255, 1), 1px -1px 0 rgba(255, 255, 255, 1), -1px 1px 0 rgba(255, 255, 255, 1)',
		  },
		backgroundImage: {
			'dots': 'radial-gradient(#ccc 1px, transparent 1px)',
			'diagonal-lines': 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 50%, #ccc 50%, #ccc 75%, transparent 75%, transparent)',
			'horizontal-lines': 'linear-gradient(#ccc 50%, transparent 50%)',
			'squares': 'linear-gradient(90deg, #ccc 1px, transparent 1px), linear-gradient(#ccc 1px, transparent 1px)',
			'zigzag': 'linear-gradient(135deg, #ccc 25%, transparent 25%) repeat',
			'hexagons': 'radial-gradient(circle, transparent 20%, #ccc 20%, #ccc 25%, transparent 25%, transparent 70%, #ccc 70%, #ccc 75%, transparent 75%)',
			'waves': 'linear-gradient(60deg, #ccc 12%, transparent 12.5%, transparent 87%, #ccc 87.5%, #ccc), linear-gradient(120deg, #ccc 12%, transparent 12.5%, transparent 87%, #ccc 87.5%, #ccc)',
			'stars': 'radial-gradient(circle, #ccc 2px, transparent 2px)',
			'water-texture': "url('public/images/bgwater.webp')",
		  },
		  backgroundSize: {
			'dots': '20px 20px',
			'diagonal-lines': '20px 20px',
			'horizontal-lines': '100% 10px',
			'squares': '20px 20px',
			'zigzag': '20px 20px',
			'hexagons': '50px 43.3px',
			'waves': '40px 40px',
			'stars': '20px 20px',
		  },
		  
		  
  		colors: {
			// Sistema de marca Olive+ (OliveMarketing/marcas/oliveplus/tokens.css). Usar en el rediseño de la home.
			marca: {
				primario: '#084D6E',
				p700: '#063D58',
				p300: '#6B97AD',
				p100: '#DCE8EE',
				p50: '#EEF4F7',
				verde: '#028C44',
				verdeOscuro: '#02753A',
				verde100: '#E7F3E9',
				ambar: '#F2BC09',
				tinta: '#3F4650',
				suave: '#5F6773',
				ink: '#16191D',
				papel: '#F7F8FA',
			},
			backColor: '#f1f1f1',
			ilback:'#fdb601',
			primary: '#084d6e', // kPrimaryColor
			primaryCopy: '#084d6e', // kPrimaryColorCopy
			clear: '#028C44', // kClearColor
			primary2: '#FF6666', // kPrimaryColor2
			primary3: '#FF9999', // kPrimaryColor3
			primary4: '#FFCCCC', // kPrimaryColor4
			primary5: '#FFF5F5', // kPrimaryColor5
			secondary: '#3A405A', // kSecondaryColor
			secondary2: '#61667B', // kSecondaryColor2
			secondary3: '#898C9C', // kSecondaryColor3
			secondary4: '#B0B3BD', // kSecondaryColor4
			secondary5: '#EBECEF', // kSecondaryColor5
			tertiary: '#2660A4', // kTertiaryColor
			tertiary2: '#5180B6', // kTertiaryColor2
			tertiary3: '#7DA0C8', // kTertiaryColor3
			tertiary4: '#A8BFDB', // kTertiaryColor4
			tertiary5: '#E9EFF6', // kTertiaryColor5
			white: '#FFFFFF', // kWhiteColor
			black: '#212427', // kBlackColor
			lightGreen: '#E9FCF8', // kLightGreenColor
			lightPurple: '#F2E9FC', // kLightPurpleColor
			olive: '#084d6e', // kOliveColor (usando kPrimaryColor)
			olive2: '#fab500', // kOliveColor2
			oliveOpacity: 'rgba(8, 77, 110, 0.8)', // kOliveColorbc
			volumen: '#00c1c6', // kVolumenColor
			caudal: '#00c1c6', // kCaudalColor
			caudalOpacity: 'rgba(0, 193, 198, 0.3)', // kCaudalColorbc
			caudalBack: '#9FCECE', // kCaudalBack
			domain: '#0059c4', // kdomainColor
			mesure: '#845b35', // kMesureColor
			freaticoBack: '#99806b', // kFreaticoBack
			device: '#6702D1', // kDeviceColor
			greyBack: '#f2f2f2', // kGreyBack
			deviceBack: '#A87CE0', // kDeviceBack
			riegoBack: '#60a07a', // kRiegoBack
			orangeBack: '#FCAD56', // kOrageBack
			chartBack: '#008891', // kChartBack
			fugasBack: '#B36074', // kFugasBack
			blk: '#3c3c3c', // kblkColor
			indicatorBack: 'rgba(75, 143, 155, 1)', // kindicatorBack
			indicatorBottom: '#cc8c5c', // kindicatorBottom
			indicatorBottom2: '#ecd49d', // kindicatorBottom2
			primaryPalette1: '#59242E', // kPrimaryPalette1
			primaryPalette2: '#80A1AE', // kPrimaryPalette2
			primaryPalette3: '#C3D3D9', // kPrimaryPalette3
			primaryPalette4: '#638A99', // kPrimaryPalette4
			notification: '#f19b23', // knotification
			allDevices: '#756192', // kAllDevices
			eto: '#FF8C00', // kEtoColor
			totalAgua: '#64B5F6', // ktotalAgua
			bajoCaudal: '#81C784', // kbBajoCaudal
			sobreCaudal: '#E57373', // ksobreCaudal
			enRango: '#FFF176', // kenRango
			fueraRango: '#FFB74D', // kfueraRango
			manuales: '#BA68C8', // kmanuales
			azulCapri: '#007FFF', // kazulcapri
			chartLow: '#D95B43', // kchartLow
			chartHigh: '#5BC0DE', // kchartHigh
			chartMedium: '#4CAF50', // kchartMedium
			bubbleInfo: '#008891', // kbubbleinfo
			whit:'#f9f9f9', // kwhit
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
	require('tailwindcss-textshadow'),
],
};
export default config;
