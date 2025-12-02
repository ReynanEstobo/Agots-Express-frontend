import {
  Award,
  ChefHat,
  Clock,
  Flame,
  Gift,
  Heart as HeartIcon,
  IceCream,
  Mail,
  MapPin,
  Phone,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFeaturedDishes, fetchLandingStats } from "../api/LandingAPI";
import { useSocket } from "../contexts/SocketContext";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

const getCategoryColor = (category) => {
  switch (category) {
    case "Best Seller":
      return "bg-yellow-500 text-white";
    case "Most Bought":
      return "bg-blue-500 text-white";
    case "New Arrival":
      return "bg-green-500 text-white";
    case "Limited Offer":
      return "bg-orange-500 text-white";
    case "Recommended":
      return "bg-pink-500 text-white";
    case "Specialty":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "Best Seller":
      return <Flame className="h-4 w-4 text-white" />;
    case "Most Bought":
      return <Star className="h-4 w-4 text-white" />;
    case "New Arrival":
      return <Zap className="h-4 w-4 text-white" />;
    case "Limited Offer":
      return <Gift className="h-4 w-4 text-white" />;
    case "Recommended":
      return <HeartIcon className="h-4 w-4 text-white" />;
    case "Specialty":
      return <IceCream className="h-4 w-4 text-white" />;
    default:
      return null;
  }
};

const Landing = () => {
  const socket = useSocket();
  const [avgRating, setAvgRating] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(null);
  const [featuredDishes, setFeaturedDishes] = useState([]);

  //typewriter effect
  const [typedText, setTypedText] = useState("");
  const phrases = [
    "Filipino Flavors",
    "Filipino Cuisine",
    "Filipino Delights",
    "Filipino Traditions",
    "Filipino Recipes",
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 100; // typing speed in ms
    const deleteSpeed = 50; // deleting speed in ms
    const pauseTime = 1500; // pause before deleting

    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (!isDeleting) {
        // Typing
        if (charIndex < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          // Finished typing, wait then delete
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setTypedText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentPhraseIndex, phrases]);

  // Initial fetch
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchLandingStats();
        setAvgRating(Number(data.avgRating) || 0);
        setTotalCustomers(Number(data.totalCustomers) || 0);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setAvgRating(0);
        setTotalCustomers(0);
      }
    };

    const loadFeaturedDishes = async () => {
      try {
        const data = await fetchFeaturedDishes();
        setFeaturedDishes(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured dishes:", err);
      }
    };

    loadStats();
    loadFeaturedDishes();
  }, []);

  // Listen for live updates via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("landingStatsUpdated", (updatedStats) => {
      setAvgRating(Number(updatedStats.avgRating) || 0);
      setTotalCustomers(Number(updatedStats.totalCustomers) || 0);
    });

    return () => {
      socket.off("landingStatsUpdated");
    };
  }, [socket]);

  const DishCard = ({ dish }) => (
    <Card className="hover:shadow-xl transition-shadow relative overflow-hidden h-72 rounded-2xl cursor-pointer group">
      {dish.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(http://localhost:5000/uploads/menu/${dish.image})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 z-10 text-white">
        <h3 className="text-lg font-semibold drop-shadow-lg">{dish.name}</h3>
        <p className="text-sm font-medium drop-shadow-lg">₱{dish.price}</p>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4 space-y-2">
        <p className="text-sm text-gray-200">{dish.description}</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {dish.category && dish.category !== "None" && (
            <Badge
              className={`flex items-center gap-1 ${getCategoryColor(
                dish.category
              )} text-xs px-2 py-1 rounded-full`}
            >
              {getCategoryIcon(dish.category)} {dish.category}
            </Badge>
          )}
          <Badge className="bg-gray-200 text-gray-800 flex items-center gap-1 text-xs px-2 py-1 rounded-full">
            {dish.group}
          </Badge>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0A1A3F]/95 backdrop-blur-sm z-50 border-b border-[#FFFFFF]/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-lg bg-[#F2C94C] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                  className="h-6 w-6 cursor-pointer transition-all duration-100 hover:animate-pulse"
                >
                  <path
                    fill="#FFFFFF"
                    d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[#FFFFFF]">
                Agot's Express
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <a
                href="#menu"
                className="text-[#FFFFFF]/80 hover:text-[#FFD966] transition-colors duration-300"
              >
                Menu
              </a>
              <a
                href="#about"
                className="text-[#FFFFFF]/80 hover:text-[#FFD966] transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-[#FFFFFF]/80 hover:text-[#FFD966] transition-colors duration-300"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3 z-10">
              <Link to="/login">
                <Button className="bg-[#FFD966] text-[#0A1A3F] hover:bg-[#FFF3B0] transition-colors duration-300">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#0A1A3F] via-[#0A1A3F] to-[#0A1A3F] text-[#FFFFFF]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-[#FFD966] text-[#0A1A3F] px-4 py-1.5">
              Filipino Cuisine with a Modern Twist
            </Badge>

            {/* Hero Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Experience Authentic
            </h1>

            {/* Animated Phrases */}
            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-[#FFD966] mt-2 min-h-[3rem]">
              {typedText}
              <span className="inline-block w-1 h-10 bg-[#FFD966] ml-1 animate-blink"></span>
            </h2>

            <p className="text-xl text-[#FFFFFF]/80 max-w-2xl mx-auto">
              Since decades ago, Agot's Restaurant has been serving traditional
              Filipino dishes made with locally sourced ingredients and love.
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <Link to="/order-menu">
                <Button className="bg-[#FFD966] text-[#0A1A3F] hover:bg-[#FFF3B0] text-lg px-8 transition-colors duration-300">
                  Order Now
                </Button>
              </Link>
              <a href="#menu">
                <Button className="bg-[#FFD966]/20 text-[#0A1A3F] hover:bg-[#FFF3B0]/40 text-lg px-8 transition-colors duration-300">
                  View Menu
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-[#FFD966]">40+</div>
                <div className="text-sm text-[#FFFFFF]/70">
                  Years Experience
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-[#FFD966]">
                  {totalCustomers !== null
                    ? totalCustomers.toLocaleString()
                    : "..."}
                </div>
                <div className="text-sm text-[#FFFFFF]/70">Happy Customers</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-[#FFD966]">
                  {typeof avgRating === "number" ? avgRating.toFixed(1) : "..."}
                </div>
                <div className="text-sm text-[#FFFFFF]/70">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section id="menu" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0A1A3F] mb-4">
              Featured Dishes
            </h2>
            <p className="text-xl text-[#9B9B9B]">
              Taste our signature Filipino specialties
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/order-menu">
              <Button className="bg-[#FFD966]/20 text-[#0A1A3F] hover:bg-[#FFF3B0]/40 transition-colors duration-300">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-6 bg-[#F5F5F5]/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#0A1A3F] mb-12">
            About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#FF8A00] to-[#FF3D00] rounded-full flex items-center justify-center mx-auto">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1A3F]">
                  Expert Chefs
                </h3>
                <p className="text-[#333333]">
                  Experienced chefs preparing authentic Filipino recipes passed
                  down through generations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#4ADE80] to-[#16A34A] rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1A3F]">
                  Fresh Ingredients
                </h3>
                <p className="text-[#333333]">
                  Only locally sourced, fresh ingredients to ensure quality and
                  authentic flavors
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#FACC15] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1A3F]">
                  5-Star Service
                </h3>
                <p className="text-[#333333]">
                  Exceptional service and warm hospitality that makes you feel
                  at home
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#0A1A3F] mb-4">
                Visit Us Today
              </h2>
              <p className="text-xl text-[#9B9B9B]">We'd love to serve you!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD966]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#FFD966]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Address</h3>
                      <p className="text-[#9B9B9B]">
                        Palikpikan Street, Balayan, Philippines
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD966]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#FFD966]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Phone</h3>
                      <p className="text-[#9B9B9B]">0917 505 8692</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD966]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#FFD966]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <p className="text-[#9B9B9B]">
                        agotscatering1977@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD966]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#FFD966]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Hours</h3>
                      <p className="text-[#9B9B9B]">
                        Everyday: 08:00 AM - 10:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6">Send us a message</h3>
                  <div className="space-y-4">
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
                    />
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
                    />
                    <textarea
                      id="contact-message"
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FFD966] resize-none"
                    />
                    <Button
                      className="w-full bg-[#FFD966] hover:bg-[#FFF3B0] transition-colors duration-300"
                      onClick={() => {
                        const name =
                          document.getElementById("contact-name").value;
                        const email =
                          document.getElementById("contact-email").value;
                        const message =
                          document.getElementById("contact-message").value;

                        const subject = encodeURIComponent(
                          `Message from ${name}`
                        );
                        const body = encodeURIComponent(
                          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                        );

                        window.location.href = `mailto:agotscatering1977@gmail.com?subject=${subject}&body=${body}`;
                      }}
                    >
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1A3F] text-[#FFFFFF] py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-[#FFFFFF]/70">
            &copy; 2024 Agot's Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
