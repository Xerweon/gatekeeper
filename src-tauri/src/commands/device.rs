use serde::Serialize;
use sysinfo::{System, Networks};
use get_if_addrs::{get_if_addrs, IfAddr};

#[derive(Serialize)]
pub struct DeviceInfo {
    os_name: String,
    os_version: String,
    host_name: String,
    mac_address: Option<String>,
}

#[tauri::command]
pub fn get_device_info() -> Result<DeviceInfo, String> {
    let mut system = System::new_all();
    system.refresh_all();

    let os_name = System::name().unwrap_or_else(|| "Unknown OS".into());
    let os_version = System::os_version().unwrap_or_else(|| "Unknown Version".into());
    let host_name = System::host_name().unwrap_or_else(|| "Unknown Device".into());

    let mut mac_address: Option<String> = None;
    let mut _iface_name: Option<String> = None;
    let mut ip_address: Option<String> = None;

    let networks = Networks::new_with_refreshed_list();

    
    for (interface_name, network) in &networks {
        let mac_addr = network.mac_address();
        
        
        let mac_bytes = [
            mac_addr.0[0], mac_addr.0[1], mac_addr.0[2],
            mac_addr.0[3], mac_addr.0[4], mac_addr.0[5]
        ];
        
        
        if mac_bytes != [0; 6] {
            let mac_str = format!(
                "{:02x}:{:02x}:{:02x}:{:02x}:{:02x}:{:02x}",
                mac_bytes[0], mac_bytes[1], mac_bytes[2],
                mac_bytes[3], mac_bytes[4], mac_bytes[5]
            );
            
            mac_address = Some(mac_str);
            _iface_name = Some(interface_name.clone());

            if let Ok(addrs) = get_if_addrs() {
                for iface in addrs {
                    if iface.name == *interface_name && !iface.is_loopback() {
                        match iface.addr {
                            IfAddr::V4(v4) => {
                                ip_address = Some(v4.ip.to_string());
                                break;
                            }
                            IfAddr::V6(v6) => {
                                if ip_address.is_none() {
                                    ip_address = Some(v6.ip.to_string());
                                }
                            }
                        }
                    }
                }
            }
            
            if ip_address.is_some() {
                break;
            }
        }
    }

    Ok(DeviceInfo {
        os_name,
        os_version,
        host_name,
        mac_address
    })
}