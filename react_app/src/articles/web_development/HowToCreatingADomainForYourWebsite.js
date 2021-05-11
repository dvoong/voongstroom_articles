import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToCreatingADomainForYourWebsite() {
    return (
	<div>

<h1>How to: Creating a domain for your website</h1>

<div>
  Published on <i>5th September 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>

  <p>When creating a website one of the first considerations will be choosing the domain of your website, finding something that is catchy and succinct is hard enough but finding one that is also available is even tougher. You can check whether a domain is available using a domain name registrar, simply search for "domain name registration" and pick one. Once you've found a domain you want you can purchase a license to use that domain for a given period of time also from a domain name registrar, you may want to do some research on which kind of license and domain name registrar is best for you. </p>

  <p>Once you have your domain you'll then need to think about how to connect that to the actual machine that will be hosting your website, i.e. the <b>host</b>. If you're using a web hosting service to create your website for you the linking between domain name and host will probably be provided for you but if you are using a cloud infrastructure service, such as DigitalOcean you may have some additional config to do.</p>

</div>

<div id="what-is-a-domain">
  <h2>What is a domain?</h2>
  <p>A domain is a region of autonomy on the internet. Your domain is your realm where you as lord can choose the content and services that are present (provided they are legal and within the terms set by your domain name registrar).</p>

  <p>Domains are structured in a hierarchial manner, at the top is the top level domain and below that are sub-domains. A domain is represented by its domain name, each level of its hierarchy is separated by a dot starting with the lowest level and ending with the top level, for example,</p>
  
  <div className="center"><p><i>www.example.com</i></p></div>

  <p>In this case this domain is also a sub-domain of the <i>example.com</i> domain which itself is a sub-domain of the top level domain <i>com</i>.</p>

  <div className="center"><p><i>www.example.com &lt example.com &lt com</i></p></div>

</div>

<div id="domain-name-system">
  <h2>Domain Name System (DNS)</h2>

  <p>The Domain Name System (DNS) is the Internet's equivalent of a phonebook, it maps domain names to IP addresses, which for example may point to a machine hosting a website or an internet resource. When you enter a web address into your web browser your computer checks the nearest available phonebook (which is called a name server) and then redirects itself to the address of the corresponding host. </p>

  <p>To add or modify an entry in the DNS you need to update the central registry, however these changes do not propogate instantly to the nameservers. Nameservers periodically read and update themselves from the central repository. It can take 12-36 hours for all the nameservers on the internet to be updated so when registering your host to your domain name do not expect it to work immediately.</p>
</div>

<div id="how-to-link-a-domain-to-a-host">
  <h2>How to link a domain to a host</h2>
  <p>In this section I'll give a quick example of how to setup your DNS configuration to link a domain name to a cloud host. In this example I have a domain name I've registered with the domain name registrar <a href="https://www.namecheap.com/">Namecheap</a> and a web application host machine which is being hosted on the <a href="www.digitalocean.com">DigitalOcean</a> cloud hosting service.</p>

  <p>First log into DigitalOcean and navigate to <b>Networking</b> section and add your domain. Note: the domain name should be the highest level of your domain, e.g. <i>my-domain.com</i> instead of <i>www.my-domain.com</i>, the lower level domains can be specified later.</p>

  <img className="article-image" style={{maxWidth: '100%'}} src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_creating_a_domain_for_your_website/fig3.png`} />

  <p>Navigate to the details section of the domain you just created and you should find a section called <b>DNS records</b> which lists a few records with type <b>NS</b> which stands for nameserver.</p>

  <img className="article-image" style={{maxWidth: '100%'}} src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_creating_a_domain_for_your_website/fig1.png`} />

  <p>Then navigate to the Namecheap (the domain name registrar) web interface and navigate to the details section of the domain you have registered. Set the nameservers to the nameservers listed in DigitalOcean. Now when a request to resolve the domain name is received it will be redirected to the name servers of DigitalOcean.</p>

  <img className="article-image" style={{maxWidth: '100%'}} src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_creating_a_domain_for_your_website/fig2.png`} />

  <p>Now the final step is to tell DigitalOcean which host (droplet in DigitalOcean terminology) the domain name should redirect to. To do this we need to create a DNS record that links the domain name to the host (droplet).</p>
  
  <img className="article-image" style={{maxWidth: '100%'}} src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_creating_a_domain_for_your_website/fig4.png`} />

  <p>Note: we created an <b>A</b> record which is a type of record that redirects to an IP address, you don't really need to concern yourself with all the types of records there are but you can see them <a href="https://en.wikipedia.org/wiki/List_of_DNS_record_types">here</a> if you're interested. Now we just have to wait for the changes to propagate. Once that is done we can simply type our domain name into a web browser and we'll be redirected to the host machine and website.</p>

  <p>Often you'll want the sub-domain of <i>www.&ltyour domain&gt</i> to also redirect to the website. For this we need to create another record. We could create another <b>A</b> record but we can also create a <b>CNAME</b> record which redirects to another record, like an alias.</p>
  
  <img className="article-image" style={{maxWidth: '100%'}} src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_creating_a_domain_for_your_website/fig5.png`} />
  
</div>

<div id="conclusion">
  <h2>Conclusion</h2>
  <p>In this article I showed how to setup DNS records for linking a domain name to a host machine. In the example above I used the Namecheap domain name registrar and the DigitalOcean cloud hosting service, but other registrars and cloud hosting services should be similar to configure since the principles are the same regardless of the provider you are using.</p>
    
</div>
          
        </div>
    );
}

export default HowToCreatingADomainForYourWebsite;
