import Link from "next/link";
import "./Button.css";

export default function Button({ 
  children, 
  variant = "primary", 
  href, 
  onClick, 
  className = "",
  external = false,
  style
}) {
  const btnClass = `btn btn-${variant} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass} style={style}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={btnClass} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={btnClass} style={style}>
      {children}
    </button>
  );
}
