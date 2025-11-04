import ContactForm from './ContactForm';
import DynamicHero from '@/components/DynamicHero';


export default function ContactPage() {
    return (
        <div>
            <DynamicHero
                title="Contact Us"
                description="Have a question? Send us a message and we will get back to you shortly."
                color="white"
                image="/faq.jpg"
            />

            <div className="container mx-auto px-4 py-20">
                <ContactForm />
            </div>
        </div>
    );
}
