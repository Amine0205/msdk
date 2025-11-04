import React from 'react';

type DynamicHeroProps = {
    title: string;
    description?: string;
    image?: string;
    color?: string;
};

export default function DynamicHero({ title, description, image, color = '' }: DynamicHeroProps) {
    const backgroundStyle = image
        ? { backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : undefined;

    return (
        <section
            className={`relative py-20 md:py-32 overflow-hidden`}
            style={backgroundStyle}
        >
            <div className="container mx-auto px-4 relative">
                <div className="mx-auto text-center">
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight text-${color}`}>
                        {title}
                    </h1>
                    {description && (
                        <p className={`text-xl mb-8 text-${color}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
