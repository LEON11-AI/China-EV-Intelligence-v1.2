
import React from 'react';

// SVG components for each brand logo. They are styled to be monochrome.
const NioLogo = () => <svg viewBox="0 0 200 60" fill="currentColor" className="h-8"><path d="M49.4,35.5h-8.8V19.7h8.8V35.5z M35.9,19.7v15.7h-8.8V19.7H35.9z M22.2,19.7v15.7H13V19.7H22.2z M100.2,28.6l-2.6,6.9h-9.3 l12-23.7h9.5l11.9,23.7h-9.3l-2.6-6.9H100.2z M104.9,24l-3-7.9l-3,7.9H104.9z M131.7,35.5h-9.2L111,11.8h9.6l8,18l8-18h9.6 L131.7,35.5z M167.4,24.1c0-4.8-3.3-8.1-8.1-8.1h-11.4v23.7h9.3V29h2.1c4.8,0,8.1-3.3,8.1-8.1V24.1z M159.3,24.1 c0,2.1-1.4,3.3-3.3,3.3h-2.1v-6.6h2.1c1.9,0,3.3,1.3,3.3,3.3V24.1z M173,11.8h9.3v23.7H173V11.8z"/></svg>;
const XiaomiLogo = () => <svg viewBox="0 0 1024 1024" fill="currentColor" className="h-10"><path d="M682.666667 170.666667H554.666667v682.666666h128V170.666667zM341.333333 469.333333v384h128v-384h-128z m-213.333333 170.666667h128v213.333333h-128v-213.333333zM853.333333 469.333333v384h128v-384h-128z"/></svg>;
const ZeekrLogo = () => <svg viewBox="0 0 128 32" fill="currentColor" className="h-6"><path d="M0 0v32h12.5V20h8.7v12h12.5V0H21.2v12h-8.7V0H0zm52.3 0L42.2 16 52.3 32h14.7L56.9 16 67 0H52.3zM78.6 0v32h12.5V20H99v12h12.5V0H99v12H91.1V0H78.6zm49.4 0L118 16l10.1 16h14.7L132.7 16 142.8 0h-14.8z" transform="scale(0.8)"/></svg>;
const LiAutoLogo = () => <svg viewBox="0 0 400 100" fill="currentColor" className="h-8"><path d="M56,66.1H44.3V33.9H56V66.1z M38.4,33.9V67c0,5.8,4.7,10.5,10.5,10.5h14.2c5.8,0,10.5-4.7,10.5-10.5V33.9H38.4z M92,33.9v32.2h11.7V33.9H92z M131,33.9v21.5h-11.7V46c0-3.2-2.6-5.8-5.8-5.8s-5.8,2.6-5.8,5.8v9.5H96.1V33.9H131z M175.4,66.1 h-11.7V45.7l-9.3,20.4h-9.7L135.4,45v21.1h-11.7V33.9h17.5l8.1,17.9l8.1-17.9h17.5V66.1z M226.7,66.1h-28.4V33.9h28.4 c7.6,0,13.7,6.1,13.7,13.7v4.8c0,7.6-6.1,13.7-13.7,13.7H226.7z M215,54.4h11.7c2.2,0,4-1.8,4-4v-4.8c0-2.2-1.8-4-4-4H215V54.4z M287.4,66.1l-11.2-15.4h-7.1v15.4h-11.7V33.9h18.9c7.6,0,13.7,6.1,13.7,13.7c0,5.4-3.1,10.1-7.6,12.3l12.4,16.2H287.4z M269.1,45.9 c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4h-7.2v8.1H269.1z M337.8,66.1l-11.2-15.4h-7.1v15.4h-11.7V33.9H326c7.6,0,13.7,6.1,13.7,13.7 c0,5.4-3.1,10.1-7.6,12.3l12.4,16.2H337.8z M319.5,45.9c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4h-7.2v8.1H319.5z M375.4,33.9l-14,32.2h-12.2 l14-32.2H375.4z M353.7,33.9h-11.7v32.2h11.7V33.9z"/></svg>;
const XpengLogo = () => <svg viewBox="0 0 100 100" fill="currentColor" className="h-10"><path d="M50 0L0 50l50 50 50-50L50 0zm0 15l25 25-25 25-25-25L50 15z"/></svg>;
const BydLogo = () => <svg viewBox="0 0 60 25" fill="currentColor" className="h-6"><path d="M4.58.67h12.65c6.55,0,9.11,4.28,9.11,8.39,0,4.22-2.56,8.5-9.11,8.5H9.29v6.52H4.58V.67Zm4.71,12.2h7.84c3.54,0,4.4-2.87,4.4-4,0-1.22-.86-4-4.4-4H9.29v8Z M31.25.67h4.71V24.08h-4.71V.67ZM41.13,17.4V.67h14.1c6,0,8.12,3.31,8.12,7.48s-2.14,7.59-8.12,7.59h-9.39v6.34h-4.71V17.4Zm4.71-4.63h9.29c2.92,0,3.31-2.25,3.31-3.69s-.38-3.69-3.31-3.69H45.84v7.38Z"/></svg>;
const AitoLogo = () => <svg viewBox="0 0 90 25" fill="currentColor" className="h-6"><path d="M12.5.6h11.2L30,17.8,36.2.6H47.5L33.2,24.1H20.8L7.5,6.2V24.1H.6V.6h9.4l7.5,10.5V.6h-5Z M60.4.6h6.9V24.1h-6.9V.6Z M82.2,24.1h-6.9V13.6h-9.2v10.5h-6.9V.6H75.3v10.5h6.9V.6h6.9V24.1Z"/></svg>;


const BrandLogos = () => {
    const brands = [
        { name: 'NIO', Logo: NioLogo },
        { name: 'Xiaomi', Logo: XiaomiLogo },
        { name: 'Zeekr', Logo: ZeekrLogo },
        { name: 'Li Auto', Logo: LiAutoLogo },
        { name: 'XPeng', Logo: XpengLogo },
        { name: 'BYD', Logo: BydLogo },
        { name: 'AITO', Logo: AitoLogo },
    ];
    return (
         <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {brands.map(({ name, Logo }) => (
                <div key={name} className="text-text-secondary hover:text-text-main transition-colors duration-300 ease-in-out" title={name}>
                    <Logo />
                </div>
            ))}
        </div>
    );
};

export default BrandLogos;
